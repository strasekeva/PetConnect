import L from 'leaflet';
import { faPaw, faGraduationCap, faPuzzlePiece, faHeartbeat, faTrophy, faBook } from '@fortawesome/free-solid-svg-icons';


export const categoryIcons = {
    walks: { icon: faPaw, color: 'blue' },
    training: { icon: faGraduationCap, color: 'maroon' },
    games: { icon: faPuzzlePiece, color: 'purple' },
    health: { icon: faHeartbeat, color: 'red' },
    competitions: { icon: faTrophy, color: 'orange' },
    education: { icon: faBook, color: 'green' }
};

export const MapCategoryIcons = {
    walks: {
        icon: L.divIcon({
            html: '<i class="fa fa-paw" style="color: white; background: blue; border-radius: 50%; padding: 20%;"></i>',
            className: 'custom-icon',
            iconSize: [40, 40]
        })
    },
    training: {
        icon: L.divIcon({
            html: '<i class="fa fa-graduation-cap" style="color: white; background: maroon; border-radius: 100%; padding: 20%;"></i>',
            className: 'custom-icon',
            iconSize: [40, 40]
        })
    },
    games: {
        icon: L.divIcon({
            html: '<i class="fa fa-puzzle-piece" style="color: white; background: purple; border-radius: 100%; padding: 20%;"></i>',
            className: 'custom-icon',
            iconSize: [40, 40]
        })
    },
    health: {
        icon: L.divIcon({
            html: '<i class="fa fa-heartbeat" style="color: white; background: red; border-radius: 100%; padding: 20%;"></i>',
            className: 'custom-icon',
            iconSize: [40, 40]
        })
    },
    competitions: {
        icon: L.divIcon({
            html: '<i class="fa fa-trophy" style="color: white; background: orange; border-radius: 100%; padding: 20%;"></i>',
            className: 'custom-icon',
            iconSize: [40, 40]
        })
    },
    education: {
        icon: L.divIcon({
            html: '<i class="fa fa-book" style="color: white; background: green; border-radius: 100%; padding: 20%;"></i>',
            className: 'custom-icon',
            iconSize: [40, 40]
        })
    }
};

export const categories = [
    { value: 'walks', label: 'Sprehodi', icon: faPaw },
    { value: 'training', label: 'Trening', icon: faGraduationCap },
    { value: 'games', label: 'Igre', icon: faPuzzlePiece },
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
