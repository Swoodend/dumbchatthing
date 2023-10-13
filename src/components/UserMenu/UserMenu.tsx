import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { Link } from 'react-router-dom';
// TODO - move this type (and all types?) somewhere that makes sense
import { FriendRequest } from '../../pages/Home/Home';
import './styles.css';

type Props = {
  friendRequests: FriendRequest[];
};

const UserMenu = ({ friendRequests }: Props) => {
  return (
    <Menu
      menuButton={
        <MenuButton>
          <div className="profile-menu-option">
            <span className="material-symbols-outlined">person</span>
            {friendRequests.length ? (
              <span className="alert-badge">*</span>
            ) : null}
          </div>
        </MenuButton>
      }
    >
      <MenuItem disabled>Settings</MenuItem>
      <MenuItem>
        <div>
          <Link to="/friend-requests">Friend Requests</Link>
        </div>
      </MenuItem>
      <MenuItem>
        <Link to="/add-friend">Add friend</Link>
      </MenuItem>
      <SubMenu label="Edit">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </SubMenu>
      <MenuItem>Print...</MenuItem>
    </Menu>
  );
};

export default UserMenu;
