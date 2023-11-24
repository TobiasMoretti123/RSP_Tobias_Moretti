class Persona {
    id;
    nombre;
    apellido;
    edad;

    constructor(id, nombre, apellido, edad) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = +edad;
    }

    toString() {
        return "ID: " + this.id +                  
        ", Nombre: " + this.nombre +                    
        ", Apellido: " + this.apellido +                    
        ", Edad: " + this.edad;
    }
}

class Futbolista extends Persona {
    equipo;
    posicion;
    cantidadGoles;

    constructor(id, nombre, apellido, edad, equipo, posicion, cantidadGoles) {
        super(id, nombre, apellido, edad);
        this.equipo = equipo;
        this.posicion = posicion;
        this.cantidadGoles = cantidadGoles;
    }

    toString() {
        return super.toString(this.id, this.nombre, this.apellido, this.edad) +
            ", Equipo: " + this.equipo +
            ", Posicion: " + this.posicion +
            ", Cantidad de Goles: " + this.cantidadGoles;
    }
}

class Profesional extends Persona {
    titulo;
    facultad;
    añoGraduacion;

    constructor(id, nombre, apellido, edad, titulo, facultad, añoGraduacion) {
        super(id, nombre, apellido, edad);
        this.titulo = titulo;
        this.facultad = facultad;
        this.añoGraduacion = añoGraduacion;
    }

    toString() {
        return super.toString(this.id, this.nombre, this.apellido, this.edad) +
            ", Titulo: " + this.titulo +
            ", Facultad: " + this.facultad+
            ", Año de Graduación: " + this.añoGraduacion;
    }
}

var divTabla = document.getElementById("divTabla");

var filtro = document.getElementById("filtro");
var elementosADibujar = document.getElementById("filtro").value;

var chkid = document.getElementById("ID");
var chknombre = document.getElementById("Nombre");
var chkapellido = document.getElementById("Apellido");
var chkedad = document.getElementById("Edad");
var chkequipo = document.getElementById("Equipo");
var chkposicion = document.getElementById("Posicion");
var chkcantidadGoles = document.getElementById("CantidadGoles");
var chktitulo = document.getElementById("Titulo");        
var chkfacultad = document.getElementById("Facultad");        
var chkañoGraduacion = document.getElementById("AñoGraduacion");

var tablaDePersonas = document.getElementById("tablaDePersonas");

var filas = tablaDePersonas.querySelectorAll('tr');

var btnAgregar = document.getElementById("btnAgregar");

var divABM = document.getElementById("divABM");

var txtnombre = document.getElementById("txtnombre").value;
var txtapellido = document.getElementById("txtapellido").value;
var txtedad = document.getElementById("txtedad").value;
var selectTipo = document.getElementById("selectTipo");
var txtAtr5 = document.getElementById("txtAtr5").value;
var lblAtr5 = document.getElementById("lblAtr5");
var txtAtr6 = document.getElementById("txtAtr6").value;
var lblAtr6 = document.getElementById("lblAtr6");
var txtAtr7 = document.getElementById("txtAtr7").value;
var lblAtr7 = document.getElementById("lblAtr7");

var btnAceptar = document.getElementById("btnAceptar");
var btnCancelar = document.getElementById("btnCancelar");

var spinner = document.getElementById("spinner");

var mostrarTabla = true;

var ordenAplicado = "idAsc";

var database = null;
var data = null;
var xhr = new XMLHttpRequest();
var personas = null;

entraSpinner();
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {                
        saleSpinner();
        if (xhr.status === 200)
        {
            database = xhr.responseText;
            data = JSON.parse(database);
            personas = data.map(obj => {
                if ('equipo' in obj) {
                    return new Futbolista(obj.id, obj.nombre, obj.apellido, obj.edad, obj.equipo, obj.posicion, obj.cantidadGoles);
                } else {
                    return new Profesional(obj.id, obj.nombre, obj.apellido, obj.edad, obj.titulo, obj.facultad, obj.añoGraduacion);
                }
            });
            dibujarTabla();
        }
        else
        {
            console.log("Falló la request HTTP");
        }
        
    }
};

xhr.open("GET", "http://localhost/dashboard/Prueba/personasFutbolitasProfesionales.php", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.send();

function entraSpinner() {
var overlay = document.getElementById("overlay");
overlay.style.display = "flex";
}

function saleSpinner() {
var overlay = document.getElementById("overlay");
overlay.style.display = "none";
}
      
function levantarDatosFormulario()
{
    txtid = document.getElementById("txtid").value;
    txtnombre = document.getElementById("txtnombre").value;
    txtapellido = document.getElementById("txtapellido").value;
    txtedad = document.getElementById("txtedad").value;
    selectTipo = document.getElementById("selectTipo");
    txtAtr5 = document.getElementById("txtAtr5").value;
    txtAtr6 = document.getElementById("txtAtr6").value;
    txtAtr7 = document.getElementById("txtAtr7").value;
}

function deshabilitarCampos()
{
    document.getElementById("txtnombre").disabled = document.getElementById("tituloABM").innerText=="Baja";
    document.getElementById("txtapellido").disabled = document.getElementById("tituloABM").innerText=="Baja";
    document.getElementById("txtedad").disabled = document.getElementById("tituloABM").innerText=="Baja";
    document.getElementById("txtAtr5").disabled = document.getElementById("tituloABM").innerText=="Baja";
    document.getElementById("txtAtr6").disabled = document.getElementById("tituloABM").innerText=="Baja";
    document.getElementById("txtAtr7").disabled = document.getElementById("tituloABM").innerText=="Baja";
}

function blanquearFormulario()
{
    document.getElementById("txtid").value="";
    document.getElementById("txtnombre").value="";
    document.getElementById("txtapellido").value="";
    document.getElementById("txtedad").value="";
    document.getElementById("txtAtr5").value="";
    document.getElementById("txtAtr6").value="";
    document.getElementById("txtAtr7").value="";
}

function alternarVista()
{

    if (mostrarTabla)
    {
        actualizarLabels();
        deshabilitarCampos();
        mostrarTabla=false;
        divTabla.style.display="none";
        divABM.style.display="inline-block";
        document.getElementById("txtid").value="A/D";
    }else
    {
        mostrarTabla=true;
        divTabla.style.display="inline-block";
        divABM.style.display="none";
    }
    dibujarTabla();
    refrescarEventListener();
}

function dibujarTabla() 
{
    filtro = document.getElementById("filtro");
    elementosADibujar = filtro.value;

    tablaDePersonas.innerHTML = "";
    
    personas.forEach((persona) => {

        var row;
        if(persona instanceof Futbolista && (elementosADibujar == "Todos" || elementosADibujar == "Futbolistas"))
        {
            row = tablaDePersonas.insertRow();

            row.setAttribute("id", persona.id);

            var idCell = row.insertCell();
            idCell.textContent = persona.id;
            idCell.classList.add("columnaID");                    

            var nombreCell = row.insertCell();
            nombreCell.textContent = persona.nombre;
            nombreCell.classList.add("columnaNombre"); 

            var apellidoCell = row.insertCell();
            apellidoCell.textContent = persona.apellido;
            apellidoCell.classList.add("columnaApellido"); 

            var edadCell = row.insertCell();
            edadCell.textContent = persona.edad;
            edadCell.classList.add("columnaEdad"); 

            var equipoCell = row.insertCell();
            equipoCell.textContent = persona.equipo;
            equipoCell.classList.add("columnaEquipo"); 

            var posicionCell = row.insertCell();
            posicionCell.textContent = persona.posicion;
            posicionCell.classList.add("columnaPosicion"); 

            var cantidadGolesCell = row.insertCell();
            cantidadGolesCell.textContent = persona.cantidadGoles;
            cantidadGolesCell.classList.add("columnaCantidadGoles"); 

            var tituloCell = row.insertCell();
            tituloCell.textContent = "N/A";
            tituloCell.classList.add("columnaTitulo"); 

            var facultadCell = row.insertCell();
            facultadCell.textContent = "N/A";
            facultadCell.classList.add("columnaFacultad"); 

            var añoGraduacionCell = row.insertCell();
            añoGraduacionCell.textContent = "N/A";
            añoGraduacionCell.classList.add("columnaAñoGraduacion"); 

            var modificarCell = row.insertCell();
            var botonMod = document.createElement("button");
            botonMod.innerText = "Modificar";
            botonMod.className = "Modificar";
            botonMod.id=persona.id;
            modificarCell.appendChild(botonMod);

            var eliminarCell = row.insertCell();
            var botonDel = document.createElement("button");
            botonDel.innerText = "Eliminar";
            botonDel.className = "Eliminar";
            botonDel.id=persona.id;
            eliminarCell.appendChild(botonDel);

        }
        else if (persona instanceof Profesional && (elementosADibujar == "Todos" || elementosADibujar == "Profesionales"))
        {
            row = tablaDePersonas.insertRow();
            
            row.setAttribute("id", persona.id);

            var idCell = row.insertCell();
            idCell.textContent = persona.id;
            idCell.classList.add("columnaID"); 

            var nombreCell = row.insertCell();
            nombreCell.textContent = persona.nombre;
            nombreCell.classList.add("columnaNombre"); 

            var apellidoCell = row.insertCell();
            apellidoCell.textContent = persona.apellido;
            apellidoCell.classList.add("columnaApellido"); 

            var edadCell = row.insertCell();
            edadCell.textContent = persona.edad;
            edadCell.classList.add("columnaEdad"); 

            var equipoCell = row.insertCell();
            equipoCell.textContent = "N/A";
            equipoCell.classList.add("columnaEquipo"); 

            var posicionCell = row.insertCell();
            posicionCell.textContent = "N/A";
            posicionCell.classList.add("columnaPosicion"); 

            var cantidadGolesCell = row.insertCell();
            cantidadGolesCell.textContent = "N/A";
            cantidadGolesCell.classList.add("columnaCantidadGoles"); 

            var tituloCell = row.insertCell();
            tituloCell.textContent = persona.titulo;
            tituloCell.classList.add("columnaTitulo"); 

            var facultadCell = row.insertCell();
            facultadCell.textContent = persona.facultad;
            facultadCell.classList.add("columnaFacultad"); 

            var añoGraduacionCell = row.insertCell();
            añoGraduacionCell.textContent = persona.añoGraduacion;
            añoGraduacionCell.classList.add("columnaAñoGraduacion"); 

            var modificarCell = row.insertCell();
            var botonMod = document.createElement("button");
            botonMod.innerText = "Modificar";
            botonMod.className = "Modificar";
            botonMod.id=persona.id;
            modificarCell.appendChild(botonMod);

            var eliminarCell = row.insertCell();
            var botonDel = document.createElement("button");
            botonDel.innerText = "Eliminar";
            botonDel.className = "Eliminar";
            botonDel.id=persona.id;
            eliminarCell.appendChild(botonDel);
        }

    });
    refrescarEventListener();
    actualizarColumnas();
    colorearFilas();
}

function colorearFilas()
{
    contador=1;
    arrayFilas=document.querySelectorAll("tr");
    arrayFilas.forEach(fila => {
        if (contador%2==0)
        {
            fila.style.backgroundColor = "#999999";
        }
        contador++;
    });            
}

function resetearCheckboxes()
{
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');

    for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = true;
    }
}

var checkboxes = document.querySelectorAll('.chkbx');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        actualizarColumnas();
    });
});

function mostrarOcultarColumna (nombre, ocultar)
{
    var headers = document.getElementById("headers");
    var tablaDatos = document.getElementById("tablaDePersonas");

    var headerCell = headers.querySelector("th."+nombre);
    var cells = tablaDatos.querySelectorAll("td."+nombre);

    if(ocultar)
    {
        headerCell.classList.add("oculta");
        for (var i = 0; i < cells.length; i++) {
        cells[i].classList.add("oculta");
        }
    }       
    else
    {
        headerCell.classList.remove("oculta");
        for (var i = 0; i < cells.length; i++) {
        cells[i].classList.remove("oculta");
        }
    }     
}

function actualizarColumnas()
{
    mostrarOcultarColumna("columnaID",!chkid.checked);

    mostrarOcultarColumna("columnaNombre",!chknombre.checked);

    mostrarOcultarColumna("columnaApellido",!chkapellido.checked);

    mostrarOcultarColumna("columnaEdad",!chkedad.checked);

    mostrarOcultarColumna("columnaEquipo",!chkequipo.checked);

    mostrarOcultarColumna("columnaPosicion",!chkposicion.checked);

    mostrarOcultarColumna("columnaCantidadGoles",!chkcantidadGoles.checked);

    mostrarOcultarColumna("columnaTitulo",!chktitulo.checked);

    mostrarOcultarColumna("columnaFacultad",!chkfacultad.checked);

    mostrarOcultarColumna("columnaAñoGraduacion",!chkañoGraduacion.checked);
}

function refrescarEventListener()
{
    var botonesMod = document.querySelectorAll(".Modificar");
    botonesMod.forEach((botonMod)=>
    {
        botonMod.addEventListener('click', () =>
        {
            modificacion(event.target.id);
        });
    });

    var botonesDel = document.querySelectorAll(".Eliminar");
    botonesDel.forEach((botonDel)=>
    {
        botonDel.addEventListener('click', () =>
        {
            baja(event.target.id);
        });
    });
}

function alta()
{
    document.getElementById("tituloABM").innerText="Alta";
    alternarVista();
    selectTipo.disabled=false;
}

function baja(id)
{   
    actualizarLabels();
    document.getElementById("tituloABM").innerText="Baja";
    alternarVista();
    completarABM(id);
}

function modificacion(id)
{
    actualizarLabels();
    document.getElementById("tituloABM").innerText="Modificación";
    alternarVista();
    completarABM(id);
}

function completarABM (idPersona)
{
    var personaAEditar;
    actualizarLabels();
    selectTipo.disabled=true;
    personaAEditar = personas.reduce((personaAEditar, persona)=>
    {
        if(persona.id==idPersona)
        {
            document.getElementById("txtid").value = persona.id;
            document.getElementById("txtnombre").value = persona.nombre;
            document.getElementById("txtapellido").value = persona.apellido;
            document.getElementById("txtedad").value = persona.edad;
            if (persona instanceof Futbolista)
            {
                selectTipo.value="Futbolista";

                document.getElementById("txtAtr5").value= persona.equipo;
                document.getElementById("txtAtr6").value= persona.posicion;
                document.getElementById("txtAtr7").value= persona.cantidadGoles;
            }
            else
            {
                selectTipo.value="Profesional";

                document.getElementById("txtAtr5").value= persona.titulo;
                document.getElementById("txtAtr6").value= persona.facultad;
                document.getElementById("txtAtr7").value= persona.añoGraduacion;
            }
        }
    },null); 
    return personaAEditar;
}

var tablaHeaders = document.getElementsByClassName("tablaHeader");

Array.from(tablaHeaders).forEach((header) => {
    header.addEventListener("click", () => {

        switch (event.target.textContent)
        {
            case "ID":
            {
                if (ordenAplicado == "idAsc")
                {
                    personas.sort(compararPorIdDesc);
                    ordenAplicado="idDesc";
                }
                else
                {
                    personas.sort(compararPorId);
                    ordenAplicado="idAsc";
                }
                dibujarTabla();
                break;
            }                        
            case "Nombre":
            {
                if (ordenAplicado == "nombreAsc")
                {
                    personas.sort(compararPorNombreDesc);
                    ordenAplicado="nombreDesc";
                }
                else
                {
                    personas.sort(compararPorNombre);
                    ordenAplicado="nombreAsc";
                }
                dibujarTabla();
                break;
            }                        
            case "Apellido":
            {
                if (ordenAplicado == "apellidoAsc")
                {
                    personas.sort(compararPorApellidoDesc);
                    ordenAplicado="apellidoDesc";
                }
                else
                {
                    personas.sort(compararPorApellido);
                    ordenAplicado="apellidoAsc";
                }
                dibujarTabla();
                break;
            }
            case "Edad":
            {
                if (ordenAplicado == "edadAsc")
                {
                    personas.sort(compararPorEdadDesc);
                    ordenAplicado="edadDesc";
                }
                else
                {
                    personas.sort(compararPorEdad);
                    ordenAplicado="edadAsc";
                }
                dibujarTabla();
                break;
            }                    
            case "Equipo":
            {
                if (ordenAplicado == "equipoAsc")
                {
                    personas.sort(compararPorEquipoDesc);
                    ordenAplicado="equipoDesc";
                }
                else
                {
                    personas.sort(compararPorEquipo);
                    ordenAplicado="equipoAsc";
                }
                dibujarTabla();
                break;
            }                    
            case "Posicion":
            {
                if (ordenAplicado == "posicionAsc")
                {
                    personas.sort(compararPorPosicionDesc);
                    ordenAplicado="posicionDesc";
                }
                else
                {
                    personas.sort(compararPorPosicion);
                    ordenAplicado="posicionAsc";
                }
                dibujarTabla();
                break;
            }                    
            case "Cantidad de Goles":
            {
                if (ordenAplicado == "cantidadGolesAsc")
                {
                    personas.sort(compararPorCantidadGolesDesc);
                    ordenAplicado="cantidadGolesDesc";
                }
                else
                {
                    personas.sort(compararPorCantidadGoles);
                    ordenAplicado="cantidadGolesAsc";
                }
                dibujarTabla();
                break;
            }                    
            case "Titulo":
            {
                if (ordenAplicado == "tituloAsc")
                {
                    personas.sort(compararPorTituloDesc);
                    ordenAplicado="tituloDesc";
                }
                else
                {
                    personas.sort(compararPorTitulo);
                    ordenAplicado="tituloAsc";
                }
                dibujarTabla();
                break;
            }                    
            case "Facultad":
            {
                if (ordenAplicado == "facultadAsc")
                {
                    personas.sort(compararPorFacultadDesc);
                    ordenAplicado="facultadDesc";
                }
                else
                {
                    personas.sort(compararPorFacultad);
                    ordenAplicado="facultadAsc";
                }
                dibujarTabla();
                break;
            }                    
            case "Año de Graduación":
            {
                if (ordenAplicado == "añoGraduacionAsc")
                {
                    personas.sort(compararPorAñoGraduacionDesc);
                    ordenAplicado="añoGraduacionDesc";
                }
                else
                {
                    personas.sort(compararPorAñoGraduacion);
                    ordenAplicado="añoGraduacionAsc";
                }
                dibujarTabla();
                break;
            }                    
            default:{}
        }
    });
});

function compararPorId(a, b) {
return a.id - b.id;
}

function compararPorNombre(a, b) {
return a.nombre.localeCompare(b.nombre);
}

function compararPorApellido(a, b) {
return a.apellido.localeCompare(b.apellido);
}

function compararPorEdad(a, b) {
return a.edad - b.edad;
}

function compararPorEquipo(a, b) 
{            
    if(a instanceof Profesional && b instanceof Profesional)
    {
        ret = 0;
    }
    else if (a instanceof Profesional)
    {
        ret = 1
    }
    else if (b instanceof Profesional)
    {
        ret = -1;
    }
    else
    {
        ret = a.equipo.localeCompare(b.equipo);
    }            
    return ret;
}

function compararPorPosicion(a, b) 
{
    if(a instanceof Profesional && b instanceof Profesional)
    {
        ret = 0;
    }
    else if (a instanceof Profesional)
    {
        ret = 1
    }
    else if (b instanceof Profesional)
    {
        ret = -1;
    }
    else
    {
        ret = a.posicion.localeCompare(b.posicion);
    }            
    return ret;
}

function compararPorCantidadGoles(a, b) 
{
    if(a instanceof Profesional && b instanceof Profesional)
    {
        ret = 0;
    }
    else if (a instanceof Profesional)
    {
        ret = 1
    }
    else if (b instanceof Profesional)
    {
        ret = -1;
    }
    else
    {
        ret = a.cantidadGoles-b.cantidadGoles;
    }  
    return ret;          
}

function compararPorTitulo(a, b) 
{
    if(a instanceof Futbolista && b instanceof Futbolista)
    {
        ret = 0;
    }
    else if (a instanceof Futbolista)
    {
        ret = 1
    }
    else if (b instanceof Futbolista)
    {
        ret = -1;
    }
    else
    {
        ret = a.titulo.localeCompare(b.titulo);
    }   
    return ret; 
}

function compararPorFacultad(a, b) 
{
    if(a instanceof Futbolista && b instanceof Futbolista)
    {
        ret = 0;
    }
    else if (a instanceof Futbolista)
    {
        ret = 1
    }
    else if (b instanceof Futbolista)
    {
        ret = -1;
    }
    else
    {
        ret = a.facultad.localeCompare(b.facultad);
    } 
    return ret;
}

function compararPorAñoGraduacion(a, b) 
{
    if(a instanceof Futbolista && b instanceof Futbolista)
    {
        ret = 0;
    }
    else if (a instanceof Futbolista)
    {
        ret = 1
    }
    else if (b instanceof Futbolista)
    {
        ret = -1;
    }
    else
    {
        ret = a.añoGraduacion - b.añoGraduacion;
    }      
    return ret;
}

function compararPorIdDesc(b, a) {
return a.id - b.id;
}

function compararPorNombreDesc(b, a) {
return a.nombre.localeCompare(b.nombre);
}

function compararPorApellidoDesc(b, a){
return a.apellido.localeCompare(b.apellido);
}

function compararPorEdadDesc(b, a){
return a.edad - b.edad;
}

function compararPorEquipoDesc(b, a)
{            
    if(a instanceof Profesional && b instanceof Profesional)
    {
        ret = 0;
    }
    else if (a instanceof Profesional)
    {
        ret = -1
    }
    else if (b instanceof Profesional)
    {
        ret = 1;
    }
    else
    {
        ret = a.equipo.localeCompare(b.equipo);
    }            
    return ret;
}

function compararPorPosicionDesc(b, a)
{
    if(a instanceof Profesional && b instanceof Profesional)
    {
        ret = 0;
    }
    else if (a instanceof Profesional)
    {
        ret = -1
    }
    else if (b instanceof Profesional)
    {
        ret = 1;
    }
    else
    {
        ret = a.posicion.localeCompare(b.posicion);
    }            
    return ret;
}

function compararPorCantidadGolesDesc(b, a)
{
    if(a instanceof Profesional && b instanceof Profesional)
    {
        ret = 0;
    }
    else if (a instanceof Profesional)
    {
        ret = -1
    }
    else if (b instanceof Profesional)
    {
        ret = 1;
    }
    else
    {
        ret = a.cantidadGoles-b.cantidadGoles;
    }  
    return ret;          
}

function compararPorTituloDesc(b, a)
{
    if(a instanceof Futbolista && b instanceof Futbolista)
    {
        ret = 0;
    }
    else if (a instanceof Futbolista)
    {
        ret = -1
    }
    else if (b instanceof Futbolista)
    {
        ret = 1;
    }
    else
    {
        ret = a.titulo.localeCompare(b.titulo);
    }   
    return ret; 
}

function compararPorFacultadDesc(b, a)
{
    if(a instanceof Futbolista && b instanceof Futbolista)
    {
        ret = 0;
    }
    else if (a instanceof Futbolista)
    {
        ret = -1
    }
    else if (b instanceof Futbolista)
    {
        ret = 1;
    }
    else
    {
        ret = a.facultad.localeCompare(b.facultad);
    } 
    return ret;
}

function compararPorAñoGraduacionDesc(b, a)
{
    if(a instanceof Futbolista && b instanceof Futbolista)
    {
        ret = 0;
    }
    else if (a instanceof Futbolista)
    {
        ret = -1
    }
    else if (b instanceof Futbolista)
    {
        ret = 1;
    }
    else
    {
        ret = a.añoGraduacion - b.añoGraduacion;
    }      
    return ret;
}

function actualizarLabels()
{
    
    if (selectTipo.value=="Futbolista")
    {
        lblAtr5.textContent="Equipo";
        lblAtr6.textContent="Posición";
        lblAtr7.textContent="Cantidad de Goles";
    }
    else if (selectTipo.value=="Profesional")
    {
        lblAtr5.textContent="Título";
        lblAtr6.textContent="Facultad";
        lblAtr7.textContent="Año de Graduación";
    }
}

filtro.addEventListener("change", (event) =>
{
    var elementosADibujar = event.target.value;
    dibujarTabla(elementosADibujar);
    if(filtro.value=="Futbolistas")
    {
        chkequipo.checked=true;
        chkposicion.checked=true;
        chkcantidadGoles.checked=true;

        chkequipo.disabled=false;
        chkposicion.disabled=false;
        chkcantidadGoles.disabled=false;

        chktitulo.checked=false;
        chkfacultad.checked=false;
        chkañoGraduacion.checked=false;

        chktitulo.disabled=true;
        chkfacultad.disabled=true;
        chkañoGraduacion.disabled=true;
    }
    else if (filtro.value=="Profesionales")
    {
        chktitulo.checked=true;
        chkfacultad.checked=true;
        chkañoGraduacion.checked=true;

        chktitulo.disabled=false;
        chkfacultad.disabled=false;
        chkañoGraduacion.disabled=false;

        chkequipo.checked=false;
        chkposicion.checked=false;
        chkcantidadGoles.checked=false;

        chkequipo.disabled=true;
        chkposicion.disabled=true;
        chkcantidadGoles.disabled=true;
    }
    else
    {
        chkequipo.checked=true;
        chkposicion.checked=true;
        chkcantidadGoles.checked=true;

        chktitulo.checked=true;
        chkfacultad.checked=true;
        chkañoGraduacion.checked=true;

        chkequipo.disabled=false;
        chkposicion.disabled=false;
        chkcantidadGoles.disabled=false;

        chktitulo.disabled=false;
        chkfacultad.disabled=false;
        chkañoGraduacion.disabled=false;
    }
    actualizarColumnas();
})   

btnAgregar.addEventListener("click", (event)=>
{
    alta();
    actualizarLabels();
});

selectTipo.addEventListener("change", (event)=>
{
    actualizarLabels();
});

btnCancelar.addEventListener("click",(event)=>
{
    alternarVista();
    blanquearFormulario();
    refrescarEventListener();
});

btnAceptar.addEventListener("click",(event)=>
{
    var error = false;
    if(document.getElementById("tituloABM").innerText=="Baja")
    {
        levantarDatosFormulario();                
        var cuerpo;
        var objetoID = {
            id: txtid
        };
        cuerpo = JSON.stringify(objetoID);   
        enviarDelete(cuerpo, "Futbolista"); 
    }
    else if (document.getElementById("tituloABM").innerText=="Alta")
    {
        levantarDatosFormulario();
        var cuerpo;

        if (txtnombre!="" && txtapellido!="" && txtedad!="" && !isNaN(txtedad) && txtedad>15)
        {
            if (selectTipo.value=="Futbolista")
            {
                if (txtAtr5!="" && txtAtr6!="" && !isNaN(txtAtr7) && txtAtr7>=0)
                {
                    var nuevoFutbolista = {
                        nombre: txtnombre,
                        apellido: txtapellido,
                        edad: txtedad,
                        equipo: txtAtr5,
                        posicion: txtAtr6,
                        cantidadGoles: txtAtr7
                    };
                    cuerpo = JSON.stringify(nuevoFutbolista);   
                    enviarPut(cuerpo, "Futbolista");                            
                }
                else{
                    error=true;
                }
            }
            else 
            {
                if (txtAtr5!="" && txtAtr6!="" && !isNaN(txtAtr7) && txtAtr7>1950)
                {
                    var nuevoProfesional = {
                        nombre: txtnombre,
                        apellido: txtapellido,
                        edad: txtedad,
                        titulo: txtAtr5,
                        facultad: txtAtr6,
                        añoGraduacion: txtAtr7
                    };
                    cuerpo = JSON.stringify(nuevoProfesional);   
                    enviarPut(cuerpo, "Profesional");                
                }
                else{
                    error=true;
                }
            }
        }
        else{
            error=true;
        }
        if(error)
        {
            alert("Error, revise los datos e intente nuevamente.");
        }
    }
    else if (document.getElementById("tituloABM").innerText=="Modificación")
    {
        levantarDatosFormulario();
        var cuerpo;

        if (txtnombre!="" && txtapellido!="" && txtedad!="" && !isNaN(txtedad) && txtedad>15)
        {
            if (selectTipo.value=="Futbolista")
            {
                if (txtAtr5!="" && txtAtr6!="" && !isNaN(txtAtr7) && txtAtr7>=0)
                {
                    var nuevoFutbolista = {
                        id: txtid,
                        nombre: txtnombre,
                        apellido: txtapellido,
                        edad: txtedad,
                        equipo: txtAtr5,
                        posicion: txtAtr6,
                        cantidadGoles: txtAtr7
                    };
                    cuerpo = JSON.stringify(nuevoFutbolista);   
                    enviarPost(cuerpo, "Futbolista");                            
                }
                else{
                    error=true;
                }
            }
            else 
            {
                if (txtAtr5!="" && txtAtr6!="" && !isNaN(txtAtr7) && txtAtr7>1950)
                {
                    var nuevoProfesional = {
                        id: txtid,
                        nombre: txtnombre,
                        apellido: txtapellido,
                        edad: txtedad,
                        titulo: txtAtr5,
                        facultad: txtAtr6,
                        añoGraduacion: txtAtr7
                        
                    };
                    cuerpo = JSON.stringify(nuevoProfesional);   
                    enviarPost(cuerpo, "Profesional");                
                }
                else{
                    error=true;
                }
            }
        }
        else{
            error=true;
        }
        if(error)
        {
            alert("Error, revise los datos e intente nuevamente.");
        }
    }
});

function enviarPut(cuerpo, clase)
{
    entraSpinner();
    var promesa = fetch("personasFutbolitasProfesionales.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }, 
        body: cuerpo
    })
    .then(response => response.json())
    .then(data => {
        var nuevaPersona;

        if (clase === "Futbolista") {
            nuevaPersona = new Futbolista(data["id"], txtnombre, txtapellido, txtedad, txtAtr5, txtAtr6, txtAtr7);
        } else {
            nuevaPersona = new Profesional(data["id"], txtnombre, txtapellido, txtedad, txtAtr5, txtAtr6, txtAtr7);
        }
        personas.push(nuevaPersona);
        
        blanquearFormulario();
        alternarVista();
        dibujarTabla();
        saleSpinner();
    })
    .catch(error => {
        alert("No se pudo generar el alta: " + error);
        
        blanquearFormulario();
        alternarVista();
        dibujarTabla();
        saleSpinner();
    });
}

async function enviarPost(cuerpo, clase) 
{
    
    entraSpinner();
    try {
        var respuesta = await fetch("personasFutbolitasProfesionales.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: cuerpo
        });

        if (respuesta.status === 200) {
            modificarValidado();
        } else {
            alert("No se pudo realizar la modificación. Código de estado: " + respuesta.status);
        }

        console.log("Respuesta:", await respuesta.text(), "con código", respuesta.status);
    } catch (error) {
        alert("No se pudo realizar la modificación: " + error);
    } finally {
        saleSpinner();
    }
}

async function enviarDelete(cuerpo)
{
    entraSpinner();
    try 
    {
        var respuesta = await fetch("personasFutbolitasProfesionales.php", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: cuerpo
        });
    } catch (error) {
        alert("No se pudo realizar la eliminación: ",error);
    }
    if (respuesta.status==200)
    {
        personas = personas.filter((persona) => persona.id != txtid);
    }
    else
    {
        alert("No se pudo realizar la eliminacion.");
    }
    console.log("Respuesta:", await respuesta.text(), "con código", respuesta.status);;
    blanquearFormulario();
    alternarVista();
    dibujarTabla();
    saleSpinner();
}

function modificarValidado()
{
    var error = false;
    var id = document.getElementById("txtid").value;
    var pos = -1;

    for(i=0;i<personas.length;i++)
    {
        if (personas[i].id==id)
        {
            pos=i;
            break;
        }
    }
    
    if (txtnombre!="" && txtapellido!="" && txtedad!="" && !isNaN(txtedad) && txtedad>15)
    {
        if (selectTipo.value=="Futbolista")
        {
            if (txtAtr5!="" && txtAtr6!="" && !isNaN(txtAtr7) && txtAtr7>=0)
            {
                personas[pos].nombre=document.getElementById("txtnombre").value;
                personas[pos].apellido=document.getElementById("txtapellido").value;
                personas[pos].edad=document.getElementById("txtedad").value;
                personas[pos].equipo=document.getElementById("txtAtr5").value;
                personas[pos].posicion=document.getElementById("txtAtr6").value;
                personas[pos].cantidadGoles=document.getElementById("txtAtr7").value;
            }
            else{
                error=true;
            }
        }
        else 
        {
            if (txtAtr5!="" && txtAtr6!="" && !isNaN(txtAtr7) && txtAtr7>1950)
            {
                personas[pos].nombre=document.getElementById("txtnombre").value;
                personas[pos].apellido=document.getElementById("txtapellido").value;
                personas[pos].edad=document.getElementById("txtedad").value;
                personas[pos].titulo=document.getElementById("txtAtr5").value;
                personas[pos].facultad=document.getElementById("txtAtr6").value;
                personas[pos].añoGraduacion=document.getElementById("txtAtr7").value;               
            }
            else{
                error=true;
            }
        }
    }
    else
    {
        error = true;
    }
    if(error)
    {
        alert("Error, revise los datos e intente nuevamente.");
    }
    else
    {
        blanquearFormulario();
        alternarVista();
        dibujarTabla();
    }
}