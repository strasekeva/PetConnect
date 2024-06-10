import React from 'react';
import 'assets/css/history.css';

const History = ({ history }) => {
    return (
        <>
            <div className="history-container">
                {history.length > 0 ? (
                    <>
                        <h2 className="history-title">Zgodovina pogovorov</h2>
                        {history.map((item, index) => (
                            <div key={index} className="history-entry">
                                <p className="history-question"><strong>V:</strong> {item.question}</p>
                                <p className="history-answer"><strong>O:</strong> {item.answer}</p>
                            </div>
                        ))}
                    </>
                ) : (
                    <p>Ni zabeleženih nobenih pogovorov.</p>
                )}
            </div>
        </>
    );
};

export default History;
