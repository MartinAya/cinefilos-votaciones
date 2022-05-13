const fs = require("fs");
const Poll = require("irv-algo/dist/poll.js").Poll;
const Ballot = require("irv-algo/dist/ballot.js").Ballot;

fun()

async function fun() {

    let nominaciones = await fs.readFileSync('nominaciones.txt', {encoding: 'utf8', flag: 'r'})
    nominaciones = nominaciones.split('\r\n')
    nominaciones = nominaciones.map(s => s.toLowerCase())

    let votos = await fs.readFileSync('votos.txt', {encoding: 'utf8', flag: 'r'})
    votos = votos.split('\r\n')
    votos = votos.filter(s => s !== '')

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

    votos = votos.map(voto => new Ballot(voto.telefono, voto.voto))

    console.log(`Total de votos: ${votos.length}`)

    votos.forEach(ballot => console.log(ballot.owner, ballot.choices.toString()))
    console.log('=================================================')

    let poll = new Poll(nominaciones, votos);

    let winner = poll.determineWinner();

    console.log(winner);
}