import { Header } from "./index";

// Example usage of the new Header component structure
export const HeaderExample = () => {
  return (
    <div>
      <h2>Basic Header Usage</h2>
      <Header>
        <Header.Left>
          <button>Menu</button>
          <div>Logo</div>
        </Header.Left>
        <Header.Center>
          <div>Search Bar</div>
        </Header.Center>
        <Header.Right>
          <button>Notifications</button>
          <button>Settings</button>
          <div>Avatar</div>
        </Header.Right>
      </Header>

      <h2>Unstyled Header Usage</h2>
      <Header unstyled className="custom-header-styles">
        <Header.Left className="custom-left">
          <span>Custom Left</span>
        </Header.Left>
        <Header.Right className="custom-right">
          <span>Custom Right</span>
        </Header.Right>
      </Header>

      <h2>Header as Different Element</h2>
      <Header as="nav" role="navigation">
        <Header.Left>
          <span>Navigation</span>
        </Header.Left>
      </Header>
    </div>
  );
};

export default HeaderExample;
