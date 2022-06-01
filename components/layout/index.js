import Nav from "../nav/index";
export default function Layout({ children }) {
  return (
    <>
      <div>{children}</div>
      <Nav />
    </>
  );
}
