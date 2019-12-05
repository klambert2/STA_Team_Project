//========================================================================
//== Project: Team Project for Web Dev                                 ===
//== Team Members: Kayla Lambert and Kyle Burgi                        ===
//== Purpose: JavaScript file for STA Bus Arrival/Depature app         ===
//== Date Created: 11/25/2019                                          ===
//== Last Modified: 11/26/2019                                         ===
//========================================================================


$(document).ready(start);

//========= Global Variables =============================================
const routes = [];
const stops = [];


$(function(){
    $('#myModal').on('show.bs.modal', function(){
        var myModal = $(this);
        clearTimeout(myModal.data('hideInterval'));
        myModal.data('hideInterval', setTimeout(function(){
            myModal.modal('hide');
        }, 3000));
    });
});


function start(){
    getRoutes();

    // ----  stop listeners ----

    //select multiple stops/routes
    $(document.body).on("mousedown", "option", function(event){
        event.preventDefault();
        $(this).prop('selected', !$(this).prop('selected'));
        stops.push(event.currentTarget.value);
        return false;
    });

    //keypress on enter for location setting
    $(document).on("keypress", function(e){
        if(e.which == 13 && $("#location").val() != ""){
            getRoutesByLocation($("#location").val());
        }
    })

    //clicking continue on routes for manual
    $("#stopContinue").click(function(event){
        $("#stopSelect").find('option').remove();
        for(let i = 0; i < routes.length; i++){
            getStops(routes[i]);
        }
        $("#stopContinue").remove();
    });

    //Toggle between manual and automatic
    $(".stopManual").click(function(){
        let $this = $(this);
        $("#location").remove();
        $("#stopSelect").find('option').remove();

        $(".stopManual").toggleClass("stopAuto");
        if($this.hasClass("stopAuto")){
            $this.text("Automatic Stop Picker");
            let loc = document.createElement("input");
            loc.setAttribute("id", "location");
            loc.setAttribute("type", "text");
            loc.setAttribute("placeholder", "Address...");
            $("#stopSelect").before(loc);
        } 
        else {
            $this.text("Manual Stop Picker");
            getRoutes();
        }
    });

    //Alert Handler
    $(".alert").fadeOut();
}

//========= Set Up Functions =============================================

// ------- All Routes ---------
function getRoutes(){
    let link = "http://52.88.188.196:8080/api/api/where/route-ids-for-agency/STA.json?key=TEST";
    $.get(link, gotRoutes, "jsonp");
}

function gotRoutes(data){
    for(let i = 0; i < data.data.list.length; i++){
        let temp = data.data.list[i].split('_');
        routes.push(temp[1]);
    }
    routes.sort(sortNumber);
    for(let i = 0; i < routes.length; i++){
        displayRoutes(routes[i]);
    }
}

function displayRoutes(route){
    let opt = document.createElement("option");
    opt.value = route;
    opt.innerHTML = "STA " + route;
    opt.setAttribute("id", route);
    
    $("#stopSelect").append(opt);
}


// ------- Routes by Location -------
function getRoutesByLocation(location){
    let loc = location.split(' ').join('+');
    let link = "https://maps.googleapis.com/maps/api/geocode/json?address=" + loc + "&key=AIzaSyC2rQCrrOuoazv2KxypU-0jAQHmU-EZmNA";
    $.get(link, getRoutesLoc, "json");
}

function getRoutesLoc(data){
    let lat = data.results[0].geometry.location.lat;
    let long = data.results[0].geometry.location.lng;

    let link = "http://52.88.188.196:8080/api/api/where/stops-for-location.json?key=TEST&lat=" + lat + "&lon=" + long + "&radius=100";
    $.get(link, gotRoutesLoc, "jsonp");
}

function gotRoutesLoc(data){
    for(let i = 0; i < data.data.list.length; i++){
        console.log(data.data.list[i]);
        displayStops(data.data.list[i].id);
    }
}



// ------- Stops ---------
function getStops(id){
    let link = "http://52.88.188.196:8080/api/api/where/stops-for-route/STA_" + id + ".json?key=TEST";
    $.get(link, gotStops, "jsonp");
}

function gotStops(data){
    for(let i = 0; i < data.data.references.stops.length; i++){
        stops.push(data.data.references.stops[i].name);
        displayStops(data.data.references.stops[i].name);
        console.log(data.data.references.stops.length);
    }
}

function displayStops(stop){
    let opt = document.createElement("option");
    opt.value = stop;
    opt.innerHTML = stop;
    opt.setAttribute("id", stop);
    
    $("#stopSelect").append(opt);
}


//----------- Color Functions ----------------
function colorChanged(){
    let colorScheme = $("#colorSelect").val();
    let color1, color2, color3;
    
    switch(colorScheme){
        case "ewu":
            color1 = "#A10022";
            color2 = "#ffffff";
            color3 = "#000000";
            break;
        case "gonzaga":
            color1 = "#041E42";
            color2 = "#C8102E";
            color3 = "#C1C6C8";
            break;
        case "christmas":
            color1 = "#146B3A";
            color2 = "#BB2528";
            color3 = "#ffffff";
            break;
        case "july4":
            color1 = "#2578B2";
            color2 = "#AD001E";
            color3 = "#ffffff";
            break;
        case "custom":
            
            break;
        default:
            color1 = "#17B3FF";
            color2 = "#55E629";
            color3 = "#ffffff";
    }
    $(":root").css("--color-1", color1);
    $(":root").css("--color-2", color2);
    $(":root").css("--color-3", color3);
}


// --------- Save Stops ----------------
function saveChanges(){
    console.log($("#stopSelect"));
    for(let i = 0; i < $("#stopSelect").val(); i++){

    }
}

//========= Helper Functions =============================================

function sortNumber(a, b){
    return a - b;
}

function makeAlert(text){
    alertDiv = document.createElement("div");
    alertDiv.setAttribute("class", "alert alert-primary");
    alertDiv.setAttribute("role", "alert");

    
}