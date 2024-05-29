import UserIcon from './icons/user.svg';
import UserCircleIcon from './icons/user-circle.svg';
import LinkIcon from './icons/link.svg';
import UserSelIcon from './icons/user-sel.svg';
import UserCircleSelIcon from './icons/user-circle-sel.svg';
import LinkSelIcon from './icons/link-sel.svg';

export const tabItems = [
  { id: 0, caption: 'Travelers', icon: UserIcon, iconSel: UserSelIcon },
  {
    id: 1,
    caption: 'Planners',
    icon: UserCircleIcon,
    iconSel: UserCircleSelIcon,
  },
  { id: 2, caption: 'Plannet Links', icon: LinkIcon, iconSel: LinkSelIcon },
];
