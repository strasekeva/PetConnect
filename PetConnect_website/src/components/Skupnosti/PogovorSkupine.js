import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import Navbar from 'components/Navbars/Navbar.js';
import SimpleFooter from 'components/Footers/SimpleFooter.js';
import { Container, Card, CardBody, CardTitle, CardText, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const PogovorSkupine = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const firestore = getFirestore();

    useEffect(() => {
        const fetchGroup = async () => {
            const groupDoc = doc(firestore, 'groups', groupId);
            const docSnap = await getDoc(groupDoc);
            if (docSnap.exists()) {
                const groupData = docSnap.data();
                setGroup(groupData);

                // Add owner to members if not already present
                if (!groupData.members.includes(groupData.user.uid)) {
                    await updateDoc(groupDoc, {
                        members: arrayUnion(groupData.user.uid)
                    });
                    setGroup({
                        ...groupData,
                        members: [...groupData.members, groupData.user.uid]
                    });
                }
            }
        };

        const fetchCurrentUser = async () => {
            const userUid = localStorage.getItem('userUid');
            if (userUid) {
                const userDoc = doc(firestore, 'users', userUid);
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) {
                    setCurrentUser({ uid: userUid, ...docSnap.data() });
                }
            }
        };

        const fetchMessages = async () => {
            const messagesCollection = collection(firestore, 'groups', groupId, 'messages');
            const messagesSnapshot = await getDocs(messagesCollection);
            const messagesList = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            messagesList.sort((a, b) => a.date.seconds - b.date.seconds);
            setMessages(messagesList);
        };

        fetchGroup();
        fetchCurrentUser();
        fetchMessages();
    }, [firestore, groupId]);

    const handleJoinGroup = async () => {
        if (currentUser) {
            const groupDoc = doc(firestore, 'groups', groupId);
            await updateDoc(groupDoc, {
                joinRequests: arrayUnion(currentUser.uid),
            });
            const updatedGroup = (await getDoc(groupDoc)).data();
            setGroup(updatedGroup);
        }
    };

    const handleApproveRequest = async (userId) => {
        const groupDoc = doc(firestore, 'groups', groupId);
        await updateDoc(groupDoc, {
            members: arrayUnion(userId),
            joinRequests: arrayRemove(userId),
        });
        const updatedGroup = (await getDoc(groupDoc)).data();
        setGroup(updatedGroup);
    };

    const handleRejectRequest = async (userId) => {
        const groupDoc = doc(firestore, 'groups', groupId);
        await updateDoc(groupDoc, {
            joinRequests: arrayRemove(userId),
        });
        const updatedGroup = (await getDoc(groupDoc)).data();
        setGroup(updatedGroup);
    };

    const handleSendMessage = async () => {
        if (currentUser && newMessage.trim()) {
            const message = {
                content: newMessage,
                date: serverTimestamp(),
                user: {
                    uid: currentUser.uid,
                    email: currentUser.email,
                }
            };
            await addDoc(collection(firestore, 'groups', groupId, 'messages'), message);
            setNewMessage('');
            const messagesCollection = collection(firestore, 'groups', groupId, 'messages');
            const messagesSnapshot = await getDocs(messagesCollection);
            const messagesList = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            messagesList.sort((a, b) => a.date.seconds - b.date.seconds);
            setMessages(messagesList);
        }
    };

    return (
        <div>
            <Navbar />
            <section className="section section-shaped section-lg">
                <div className="shape shape-style-1 shape-default alpha-4">
                    <span />
                </div>
            </section>
            <main>
                <Container className="mt-5">
                    {group ? (
                        <Card>
                            <CardBody>
                                <CardTitle tag="h3">
                                    {group.name}
                                    {currentUser && group.members && group.members.includes(currentUser.uid) && (
                                        <span style={{ marginLeft: '10px', color: '#28a745' }}>(Tvoja skupina)</span>
                                    )}
                                </CardTitle>
                                <CardText>{group.description}</CardText>
                                <CardText>
                                    <small className="text-muted">
                                        Ustvaril {group.user.email} dne {new Date(group.date.seconds * 1000).toLocaleString()}
                                    </small>
                                </CardText>
                                {currentUser && currentUser.uid === group.user.uid ? (
                                    <>
                                        <Button color="primary" onClick={() => navigate(`/edit-group/${groupId}`)}>Uredi</Button>
                                        <h5 className="mt-4">Join Requests</h5>
                                        {group.joinRequests && group.joinRequests.length > 0 ? (
                                            group.joinRequests.map((request, index) => (
                                                <div key={index}>
                                                    <span>{request}</span>
                                                    <Button color="success" onClick={() => handleApproveRequest(request)}>Approve</Button>
                                                    <Button color="danger" onClick={() => handleRejectRequest(request)}>Reject</Button>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No join requests</p>
                                        )}
                                    </>
                                ) : (
                                    currentUser &&
                                    !group.members?.includes(currentUser.uid) &&
                                    !group.joinRequests?.includes(currentUser.uid) && (
                                        <Button color="primary" onClick={handleJoinGroup}>Request to Join</Button>
                                    )
                                )}
                            </CardBody>
                        </Card>
                    ) : (
                        <p>Loading...</p>
                    )}
                    {currentUser && group && group.members && group.members.includes(currentUser.uid) && (
                        <div className="mt-5">
                            <h4>Skupinski Pogovor</h4>
                            <Card className="mb-3">
                                <CardBody style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {messages.length > 0 ? (
                                        messages.map((message, index) => (
                                            <div key={index} style={{
                                                display: 'flex',
                                                justifyContent: message.user.uid === currentUser.uid ? 'flex-end' : 'flex-start',
                                                marginBottom: '10px'
                                            }}>
                                                <div style={{
                                                    background: message.user.uid === currentUser.uid ? '#DCF8C6' : '#FFFFFF',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '10px',
                                                    padding: '10px',
                                                    maxWidth: '60%'
                                                }}>
                                                    <strong>{message.user.email}:</strong> {message.content}
                                                    <br />
                                                    <small className="text-muted">{new Date(message.date.seconds * 1000).toLocaleString()}</small>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Ni sporočil.</p>
                                    )}
                                </CardBody>
                            </Card>
                            <Form inline onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                                <FormGroup className="mb-2 mr-sm-2 mb-sm-0" style={{ width: '100%' }}>
                                    <Label for="message" className="mr-sm-2">Sporočilo</Label>
                                    <Input
                                        type="text"
                                        name="message"
                                        id="message"
                                        placeholder="Vnesi sporočilo"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        style={{ width: '80%' }}
                                    />
                                    <Button color="primary" style={{ width: '18%' }}>Pošlji</Button>
                                </FormGroup>
                            </Form>
                        </div>
                    )}
                </Container>
            </main>
            <SimpleFooter />
        </div>
    );
};

export default PogovorSkupine;
