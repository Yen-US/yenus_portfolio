export default function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-muted-foreground">
      <p>
        Made with{" "}
        <span className="text-red-500" aria-label="love">
          &hearts;
        </span>{" "}
        by YenUS &middot; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
