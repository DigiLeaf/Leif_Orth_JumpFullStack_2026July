import styled from 'styled-components';

// The main wrapper for the header navigation bar
export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  alignItems: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e5e7eb;
`;

// Brand/Logo styling
export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
  cursor: pointer;
`;

// Wrapper for the link items
export const MenuList = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

// Individual list item
export const MenuItem = styled.li`
  /* Styling hooks can be added here if needed */
`;

// The actual clickable link
export const MenuLink = styled.a`
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
  }
`;