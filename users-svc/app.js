// app.js
const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")
const { PORT, JWT_SECRET } = require('./config')

//middleware
app.use(cors())
app.use(express.json())

// JWT GENERATOR

const jwt = require("jsonwebtoken")

const jwtGenerator = (userId, user) => {
  // genera un token jwt para el usuario dado
  if (userId) {
    const payload = {
      user: userId,
      name: user.name,
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1hr" })
  }
  return "invalid token"
}

// ENCRYPT PASSWORD

const bcrypt = require("bcrypt")

const encrypt = async (password) => {
  //  Encriptar password usand bCrypt
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const bcryptPassword = await bcrypt.hash(password, salt)
  return bcryptPassword
}


// CHECK PASSWORD

const compare = async (plainPassword, password) => {
  return await bcrypt.compare(plainPassword, password)
}

// registrar usuario
app.post("/register", async (req, res) => {
  // #swagger.description = 'Endpoint para registrar un nuevo usuario en la  plataforma'

  try {
    // 1. destructurar req.body para obtner (name, email, password)
    const { name, email, password, birthday } = req.body


    // 2. verificar si el usuario existe (si existe lanzar un error, con throw)
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (user.rows.length !== 0) {
      return res.status(401).send("Usuario ya existe")
    }

    // 3. Encriptar password usand bCrypt
    bcryptPassword = await encrypt(password)

    // 4. agregar el usuario a la base de datos
    const newUser = await pool.query(
      "INSERT INTO users(name, email, password, birthday) values($1, $2, $3, $4) RETURNING *",
      [name, email, bcryptPassword, birthday])

    token = jwtGenerator(newUser.rows[0].id, newUser.rows[0])
    res.json({ token })
  } catch (err) {
    console.log(err)
    res.status(500).send("Server error")
  }
})

// verificar usuario
app.post("/login", async (req, res) => {
  // #swagger.description = 'Endpoint para obtener un token de sesión para el usuario'
  try {
    // 1. destructurizar req.body
    const { email, password } = req.body

    console.log('login ', email)
    // 2. verificar si el usuario no existe (si no emitiremos un error)
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (user.rows.length === 0) {
      return res.status(401).json("Password incorrecta o email no existe")
    }

    // 3. verificar si la clave es la misma que está almacenada en la base de datos
    const validPassword = await compare(password, user.rows[0].password)
    console.log("plain", password, user.rows[0].password)
    if (!validPassword) {
      return res.status(401).json("Password incorrecta o email no existe")
    }

    // 4. entregar un token jwt 
    const token = jwtGenerator(user.rows[0].id, user.rows[0])
    res.json({ token })
  } catch (err) {
    console.log(err)
    res.status(500).send("Server error")
  }
})

// Un middleware para validar JWT
const authorization = async (req, res, next) => {
  try {
    // 1. obtiene el token del header del request
    const jwToken = req.header("token")

    // 2. si no hay token presente es un error
    if (!jwToken) {
      return res.status(403).json("No autorizado")
    }

    // 3. valida el token y obtiene el payload, si falla tirará una excepción
    const payload = jwt.verify(jwToken, JWT_SECRET)

    // 4. rescatamos el payload y lo dejamos en req.user
    req.user = payload.user

    // 5. continua la ejecución del pipeline
    next()
  } catch (err) {
    console.error(err.message)
    return res.status(403).json("No autorizado")
  }
}

app.get("/verify", authorization, async (req, res) => {
  // #swagger.description = 'Endpoint para validar un token'
  try {
    res.json(true)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})



app.listen(PORT, () => {
  console.log("servidor iniciado en puerto " + PORT)
})