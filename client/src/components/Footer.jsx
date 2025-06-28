import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container className="text-center">
        © {new Date().getFullYear()} XYZ College | All rights reserved.
      </Container>
    </footer>
  );
}
export default Footer;
