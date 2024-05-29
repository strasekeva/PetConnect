import { faPaw, faGraduationCap, faDice, faHeartbeat, faTrophy, faBook, faHome, faUsers, faFutbol, faCamera } from '@fortawesome/free-solid-svg-icons';

export const categoryIcons = {
    walks: { icon: faPaw, color: 'blue' },
    training: { icon: faGraduationCap, color: 'orange' },
    games: { icon: faDice, color: 'purple' },
    health: { icon: faHeartbeat, color: 'red' },
    competitions: { icon: faTrophy, color: 'yellow' },
    education: { icon: faBook, color: 'green' }
};

export const categories = [
    { value: 'walks', label: 'Sprehodi', icon: faPaw },
    { value: 'training', label: 'Trening', icon: faGraduationCap },
    { value: 'games', label: 'Igre', icon: faDice },
    { value: 'health', label: 'Zdravje', icon: faHeartbeat },
    { value: 'competitions', label: 'Tekmovanja', icon: faTrophy },
    { value: 'education', label: 'Izobraževanje', icon: faBook }
];

export const isNew = (createdAt) => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return createdAt && createdAt.getTime() >= oneDayAgo.getTime();
};

export const isSoon = (date) => {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    return date.seconds * 1000 <= oneWeekFromNow.getTime();
};
