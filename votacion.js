const fs = require("fs");
const Poll = require("irv-algo/dist/poll.js").Poll;
const Ballot = require("irv-algo/dist/ballot.js").Ballot;

fun()

async function fun() {

    let ganador

    let nominaciones = await fs.readFileSync('nominaciones.txt', {encoding: 'utf8', flag: 'r'})
    nominaciones = nominaciones.split('\r\n')
    nominaciones = nominaciones.map(s => s.toLowerCase())
    nominaciones = nominaciones.map((s => {
        s = s.split('\'').join('')
        s = s.split('’').join('')
        return s
    }))

    let votos = await fs.readFileSync('votos.txt', {encoding: 'utf8', flag: 'r'})
    votos = votos.split('\r\n')
    votos = votos.filter(s => s !== '')
    votos = votos.map((s => {
        s = s.split('\'').join('')
        s = s.split('’').join('')
        return s
    }))

    let telefonos = votos.filter((_, index) => index % 2 === 0)
    votos = votos.filter((_, index) => index % 2 !== 0)
    votos = votos.map(s => s.toLowerCase())

    votos = votos.map((voto, index) => {
        let telefono = telefonos[index]
        return {
            telefono,
            voto
        }
    })

    votos.forEach(voto_ => {
        let peliculasVotadas = []
        nominaciones.forEach(nominacion => {
            peliculasVotadas.push({
                index: voto_.voto.indexOf(nominacion),
                nominacion
            })
        })
        peliculasVotadas = peliculasVotadas.filter(peliculaVotada => peliculaVotada.index !== -1)
        peliculasVotadas = peliculasVotadas.sort((v1,v2) => v1.index - v2.index)
        voto_.voto = peliculasVotadas.map(peliculaVotada => peliculaVotada.nominacion)
    })

    console.log(`Total de votos: ${votos.length}`)

    console.log('=================================================')

    votos.forEach((voto, indice) => console.log(telefonos[indice], voto.voto.toString()))

    console.log('=================================================')

    // metodo ranked vote por puntaje

    let puntajes = Object.fromEntries(nominaciones.map(pelicula => [pelicula, 0]))

    votos.forEach(voto_ => {
        voto_.voto.forEach((peliculaVotada, posicion) => {
            let puntaje = 1 / (posicion + 1)
            puntajes[peliculaVotada]+=puntaje
        })
    })

    puntajes = Object.entries(puntajes)
    puntajes = puntajes.sort((p1,p2) => p2[1] - p1[1])

    console.log('Puntajes')

    puntajes.forEach(puntaje => console.log(puntaje[0], ` -> ${puntaje[1]}`))

    console.log('=================================================')

    ganador = puntajes[0][0]

    // metodo ranked vote por rondas

    // votos = votos.map(voto => new Ballot(voto.telefono, voto.voto))

    // let poll = new Poll(nominaciones, votos);
    //
    // ganador = poll.determineWinner();
    //

    console.log(`Ganador: ${ganador}`);
}