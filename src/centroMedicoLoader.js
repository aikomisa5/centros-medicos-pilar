function centrosLoader(url) {
    this.url = url;
    var latlngs = [];
    var centrosLista = [];
    var centroLayer;
    var marker;
    this.finishedLoad = false;



    this.cargarCentrosPorTipo = function (tipo, map){
      //centroLayer = L.featureGroup().addTo(map); // es un featureGroup


        console.log("here", tipo);
        if(centrosLista.length==0){
          console.log("VACIO");
        }
        else {
          console.log("Hay centros cargados!");
        }

        centrosLista.forEach(function(cent) {
          var centroMedico = new CentroMedico(cent.id, cent.nombre, cent.especialidad,
                cent.telefono, cent.telefono2, cent.horario, cent.pais, cent.provincia, cent.localidad, cent.calle, cent.numero
            );
            console.log("Datos del Centro: "+centroMedico.showDetails());

            if (centroMedico.especialidad == tipo){
              map.layersControl.removeLayer(marker);
              console.log("CENTRO QUE MATCHEA");
            }
            else {
              console.log("No matchea ningun centro");
            }
        });



      }




    this.loadCentros = function(map) {
        //modifica el html para mostrar la info del centro
      /*  function mostrarDatos(centro) {
            centro = "<h3 > Centro " +
                centro.id +
                "<small> Nombre: " +
                centro.nombre +
                "</small>" +
                "<small> Calle: " +
                centro.calle +
                "</small>" +
                "<small> Numero: " +
                centro.numero +
                "</small>" +
                "</h3>";
            $("#centro").hide();
            $("#centro").empty();
            $("#centro").append(centro);
            $("#centro").show(500);
        }
*/
        // recibe el listado de centros a procesar
        function generarArrayDeCentrosPositions(centrosList) {
            console.log("generando array de coordenadas de centros");

            centrosList.forEach(function(centro) {
                console.log("coordenada centro: " + centro.lat + ", " + centro.lon);
                latlngs.push([centro.lat, centro.lon]);
                centrosLista.push([new centroMedico(centro.id, centro.nombre, centro.especialidad, centro.telefono, centro.telefono2, centro.horario,
                centro.pais, centro.provincia, centro.localidad, centro.calle, centro.numero)]);
            });
        }

        function cargarMapa(centrosListResponse, self) {
            console.log("callback llamado");
            centroLayer = L.featureGroup().addTo(map); // es un featureGroup
            // Agregamos el layer al control
            //Sirve para activar y descativar todos los marcadores pertenecientes al layer
            //map.layersControl.addOverlay(centroLayer, "Centros Medicos");
            console.log("Añadiendo Centros Medicos al Mapa");
            centrosListResponse.centros.forEach(function(centro) {
                var centroMedico = new CentroMedico(centro.id, centro.nombre, centro.especialidad, centro.telefono, centro.telefono2, centro.horario,
                centro.pais, centro.provincia, centro.localidad, centro.calle, centro.numero);
                centroMedico.addPosition(centro.coordinate.lat, centro.coordinate.lon);
                marker = L.marker([centro.coordinate.lat, centro.coordinate.lon]);

                marker.bindPopup("<b>"+centro.nombre+"</b>"+"<br>"+centro.calle + " " + centro.numero).openPopup();

                centroLayer.addLayer(marker);
                centrosLista.push(centroMedico);
                console.log(centroMedico.showDetails());
            });

            self.finishedLoad = true;
        }

        console.log("ejecutando request sobre url: " + url);
        requestJSON(url , cargarMapa, this);

    }

}