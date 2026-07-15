import { NavLink } from 'react-router-dom';
import { HeaderWrapper, NavList, NavItem, NavLinkStyled } from './Header.styled';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/services', label: 'Services' },
];

const Header = () => (
  <HeaderWrapper data-testid="Header">
    <div className="brand">Northstar Bank</div>
    <NavList>
      {navItems.map((item) => (
        <NavItem key={item.to}>
          <NavLinkStyled as={NavLink} to={item.to} end={item.to === '/'}>
            {item.label}
          </NavLinkStyled>
        </NavItem>
      ))}
    </NavList>
  </HeaderWrapper>
);

export default Header;
