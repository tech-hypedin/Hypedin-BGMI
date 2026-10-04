export const getRankIcon = async (rank) => {
    let rankIcon;
    if (rank === 'Bronze') {
        rankIcon = await import('../../public/icons/BronzeIcon.png');
    } else if (rank === 'Silver') {
        rankIcon = await import('../../public/icons/SilverIcon.png');
    } else if (rank === 'Gold') {
        rankIcon = await import('../../public/icons/GoldIcon.png');
    } else if (rank === 'Platinum') {
        rankIcon = await import('../../public/icons/PlatinumIcon.png');
    } else if (rank === 'Diamond') {
        rankIcon = await import('../../public/icons/DiamondIcon.png');
    } else if (rank === 'Crown') {
        rankIcon = await import('../../public/icons/CrownIcon.png');
    } else if (rank === 'Ace') {
        rankIcon = await import('../../public/icons/AceIcon.png');
    } else if (rank === 'Conqueror') {
        rankIcon = await import('../../public/icons/ConquerorIcon.png');
    }
    return rankIcon;
}