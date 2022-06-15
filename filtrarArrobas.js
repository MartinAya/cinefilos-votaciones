const fs = require("fs");


fun()

async function fun() {
    let arrobas = await fs.readFileSync('WhatsApp Chat with Cinéfilos Uruguay NOMINAR.txt', {encoding: 'utf8', flag: 'r'})
    arrobas = arrobas.split('\n')
    let arrobas_ = []
    arrobas.forEach(comentario => {
        try {
            arrobas_.push({
                fecha: comentario.split('-')[0].split(',')[0],
                numero: comentario.split('-')[1].split(':')[0],
                comentario: comentario.split('-')[1].split(':')[1]
            })
        } catch (e) {
            arrobas_[arrobas_.length - 1].comentario = arrobas_[arrobas_.length - 1].comentario + comentario
        }
    })
    arrobas_ = arrobas_.filter(t => t.comentario)
    arrobas = arrobas_
    let fechas = ['13/06/2022', '14/06/2022']
    arrobas = arrobas.filter(comentario => fechas.indexOf(comentario.fecha) !== -1)
    arrobas = arrobas.filter(comentario => comentario.comentario.includes('@59899983172') || comentario.comentario.includes('@martin'))
    console.log(arrobas.map(t => t.comentario))

}