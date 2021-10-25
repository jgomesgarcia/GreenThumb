
document.querySelectorAll("#filter .dropdown").forEach( (e,i)=> {
    e.onclick = function() {
        const optionsContainer = document.querySelector(`#${e.id} + .dropdown_options_background`);
        optionsContainer.className = "dropdown_options_background active";
    }
})

document.querySelectorAll("#filter .dropdown_options_background").forEach( (e,i)=> {
    e.onclick = () => {
        e.className = "dropdown_options_background";
    }
})

document.querySelectorAll("#filter .dropdown_option").forEach( (e,i)=> {
    e.onclick = function(ev) {
        ev.stopPropagation();
        document.querySelector(`#${e.getAttribute("reference")} > span`).innerHTML = e.innerHTML; 
        document.querySelector(`#${e.getAttribute("reference")}`).value = e.value;
        
        document.querySelector(".dropdown_options_background.active").className = "dropdown_options_background";
        GetPlants();
    }
})

async function GetPlants(){
    const sun = document.querySelector("#sun").getAttribute("value")
    const water = document.querySelector("#water").getAttribute("value")
    const pets = document.querySelector("#pets").getAttribute("value")

    if(!!sun && !!water && !!pets){
        try {
            const plants = await doRequest(
                "GET", 
                `https://front-br-challenges.web.app/api/v2/green-thumb/?sun=${sun}&water=${water}&pets=${pets}`
            )
            ShowPlants(plants);
            document.querySelector("#plants").setAttribute("result", true);
        } catch (error) {
            console.log(error.response);
            if(error?.responseJSON?.status === 404)
                document.querySelector("#plants").setAttribute("result", false);
            else 
                alert("Error");
        }
        
    }
}

function doRequest(method, url) {
    return new Promise ((resolve, reject) => {
      $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': method,
        'url': url,
        'dataType': 'json',
      })
      .done((res) => resolve(res))
      .fail((err)=> reject(err));
    }); 
}

function ShowPlants(plants){
    $("#items_container").empty();

    plants.forEach(e => $("#items_container").append(`
        <div class="item" id="item_${e.id}">
        <div class="item_img" style="background-image: url(${e?.url})">
            <div class="tag_favorite" style="${e.staff_favorite ? "" : "display:none"}">
                <span>✨ Staff favorite</span>
            </div>
        </div>
        <div class="item_footer">
        <span class="item_label">
            ${e?.name}
        </span>
        <div class="item_details">
            <span class="item_price">
            $ ${e?.price}
            </span>
            <div class="item_filters">
                ${e?.toxicity ? `<img src="images/icons/toxic.svg" alt="Toxic"></img>` : `<img src="images/icons/pet.svg" alt="non toxic"></img>`}
                
                ${e?.sun === "no" ? 
                    `<img src="images/icons/no-sun.svg" alt="No Sun">`
                : (e?.sun === "low" ? 
                    `<img src="images/icons/low-sun.svg" alt="Low Sun">`
                    : (e?.sun === "high" ? 
                        `<div>
                            <img src="images/icons/low-sun.svg" alt="High Sun">
                            <img src="images/icons/low-sun.svg" alt="High Sun">
                        </div>`
                        : ""))
                }
                
                ${e?.water === "rarely" ? 
                    `<img src="images/icons/1-drop.svg" alt="rarely">`
                : (e?.waterun === "daily" ? 
                    `<img src="images/icons/2-drops.svg" alt="daily">`
                    : (e?.water === "regularly" ? 
                        `<img src="images/icons/3-drops.svg" alt="regularly">`
                        : ""))
                }
                
            </div>
        </div>
        </div>
    </div>
    `))
}