import { faPaw, faGraduationCap, faDice, faHeartbeat, faTrophy, faBook, faHome, faUsers, faFutbol, faCamera } from '@fortawesome/free-solid-svg-icons';

export const categoryIcons = {
    walks: { icon: faPaw, color: 'blue' },
    training: { icon: faGraduationCap, color: 'orange' },
    games: { icon: faDice, color: 'purple' },
    health: { icon: faHeartbeat, color: 'red' },
    competitions: { icon: faTrophy, color: 'yellow' },
    education: { icon: faBook, color: 'green' },
    adoption: { icon: faHome, color: 'cyan' },
    family: { icon: faUsers, color: 'pink' },
    sports: { icon: faFutbol, color: 'black' },
    photography: { icon: faCamera, color: 'gray' },
};

export const categories = [
    { value: 'walks', label: 'Sprehodi', icon: faPaw },
    { value: 'training', label: 'Trening', icon: faGraduationCap },
    { value: 'games', label: 'Igre', icon: faDice },
    { value: 'health', label: 'Zdravje', icon: faHeartbeat },
    { value: 'competitions', label: 'Tekmovanja', icon: faTrophy },
    { value: 'education', label: 'Izobraževanje', icon: faBook },
    { value: 'adoption', label: 'Adopcija', icon: faHome },
    { value: 'family', label: 'Družinski dnevi', icon: faUsers },
    { value: 'sports', label: 'Šport', icon: faFutbol },
    { value: 'photography', label: 'Fotografija', icon: faCamera },
];
