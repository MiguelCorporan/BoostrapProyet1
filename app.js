document.addEventListener("DOMContentLoaded", () => fetcData() )

const fetcData = async () => {
    try {
        const res = await fetch('Produ.json')
        const data = await res.json()
        pintarProductos(data)
        detectarBotones(data)
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

const contenedorProductos = document.querySelector('#contenedor-productos')
const pintarProductos = (data) => {
        const template = document.querySelector('#template-Productos').content
        const fragmen = document.createDocumentFragment()

    data.forEach( producto => {
        template.querySelector('img').setAttribute('src', producto.ImagenesApi)
        template.querySelector('h5').textContent = producto.title
        template.querySelector('p span').textContent = producto.precio
        template.querySelector('button').dataset.id = producto.id

        const clone = template.cloneNode(true)
        fragmen.appendChild(clone)
    });

    contenedorProductos.appendChild(fragmen)
}

let Carrito = {}


const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button')
    
    botones.forEach( Boton => {
        Boton.addEventListener('click', () => {
            const producto = data.find(item => item.id == parseInt(Boton.dataset.id))
            producto.cantidad = 1
            if (Carrito.hasOwnProperty(producto.id)) {
                producto.cantidad = Carrito[producto.id].cantidad + 1
            } 

            Carrito[producto.id] = {...producto}
            pintarCarrito()
        })
    });

}

const items = document.querySelector('#items')
const pintarCarrito = () => {

    items.innerHTML = ''

    const template = document.querySelector('#template-carrito').content
    const fragmen = document.createDocumentFragment()

    Object.values(Carrito).forEach(product => {
        console.log(product);
        template.querySelector('th').textContent = product.id
        template.querySelectorAll('td')[0].textContent = product.title
        template.querySelectorAll('td')[1].textContent = product.cantidad
        template.querySelector('span').textContent = product.precio * product.cantidad

        //Botones
        template.querySelector('.btn-info').dataset.id  = product.id
        template.querySelector('.btn-danger').dataset.id  = product.id


        const clone = template.cloneNode(true)
        fragmen.appendChild(clone)
    })

    items.appendChild(fragmen)

    pintarFooter()
    accionBotones()
}

const footer = document.querySelector('#footer-carrito')
const pintarFooter = () => {

    footer.innerHTML = ''

    if(Object.keys(Carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacio</th>`

        return
    }

    const template = document.querySelector('#template-footer').content
    const fragmen = document.createDocumentFragment()

    const Ncantidad = Object.values(Carrito).reduce((a, {cantidad}) => a + cantidad, 0)
    const Ntotal = Object.values(Carrito).reduce((a, {cantidad, precio}) => a + cantidad * precio, 0)

    template.querySelectorAll('td')[0].textContent = Ncantidad
    template.querySelector('span').textContent = Ntotal

    const clone = template.cloneNode(true)
    fragmen.appendChild(clone)

    footer.appendChild(fragmen)

    const vaciarCarrito = document.querySelector('#vaciar-carrito')
    vaciarCarrito.addEventListener('click', () => {
        Carrito = {}
        pintarCarrito()
    })
    
    console.log(Ntotal);
}


const accionBotones = () => {
    const bonotesAgregar = document.querySelectorAll('#items .btn-info')
    const bonotesEliminar = document.querySelectorAll('#items .btn-danger')

    bonotesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {
            const producto = Carrito[btn.dataset.id]
            producto.cantidad ++
            Carrito[btn.dataset.id] = {...producto}
            pintarCarrito()
        })
    })


    bonotesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {
            const producto = Carrito[btn.dataset.id]
            producto.cantidad --

            if (producto.cantidad === 0) {
                delete Carrito[btn.dataset.id]
                pintarCarrito()
            } else {
                Carrito[btn.dataset.id] = {...producto}
                pintarCarrito()
            }
        })
    })


}