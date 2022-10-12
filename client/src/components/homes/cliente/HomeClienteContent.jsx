const HomeClienteContent = ({user}) => {
  
  return(
    <div className="home-title-section" style={{backgroundImage: "url('/cool-background.png')", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
      <div className="glassmorphism home-title fw-bold">
        <h1 className="display-4 fw-bold">BIENVENIDO</h1>
        <h1 className="display-4 fw-bold">{user?.get("nombre").toUpperCase()}</h1>
        <p>Resúmen desde tu último acceso</p>
      </div>
    </div>
)
}

export default HomeClienteContent;
