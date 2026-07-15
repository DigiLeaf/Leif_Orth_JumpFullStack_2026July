import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;
  border-radius: 0 0 20px 20px;

  .brand {
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f172a;
  }
`;

export const NavList = styled.ul`
  display: flex;
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const NavItem = styled.li``;

export const NavLinkStyled = styled(NavLink)`
  text-decoration: none;
  color: #475569;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover,
  &.active {
    background: #eff6ff;
    color: #2563eb;
  }
`;
