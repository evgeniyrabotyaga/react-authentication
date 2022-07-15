import NavigationBar from "./NavigationBar";

const Layout = (props) => {
  return (
    <>
      <NavigationBar />
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
