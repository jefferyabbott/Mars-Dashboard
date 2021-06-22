let store = {
    selectedRover: '',
    roverData: {},
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state);
    
    // set selected rover details
    if (state.selectedRover) {
        const rDisplay = document.getElementById('rover_display');
        rDisplay.innerText = state.selectedRover;
    }
    
    // show images
    if (Object.keys(state.roverData).length !== 0) {
        const imageContainer = document.getElementById('rover_images');
        const images = state.roverData.map((r) => {
            const imgElement = document.createElement('img');
            imgElement.src = r.img_src;
            imageContainer.appendChild(imgElement);
            return r.img_src;
        });
    }
    
    
}

const displayRoverData = (rover) => {
    store.selectedRover = rover 
    loadRoverImages(rover)
}

// generate menu
const roverLinks = (rovers) => {
    htmlText = '<div class="menu"><ul>'
    rovers.forEach((r) => {
        htmlText += `<li onclick="displayRoverData('${r}')">${r}</li>`
    })
    htmlText += '</ul></div>'
    return htmlText
}

// create content
const App = (state) => {
    let { rovers } = state

    return `
        <header>
            <h1>Mars Dashboard</h1>
            <hr/>
            <div>${roverLinks(rovers)}</div>
        </header>
        <hr/>
        <main>
            <div id="rover_display"></div>
            <div id="rover_images"></div>
        </main>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

const ShowImages = (photos) => {
    if (photos.length !== 0) {
        console.log(photos)
    }
}



// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

const loadRoverImages = (rover) => {
    let url = new URL(`http://localhost:3000/nasa?rover=${rover}`);
    fetch(url)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Oops! Something went wrong! Please try again.');
            }
        }).then(data => {
            const roverData = data.roverData.photos
            updateStore(store, {...store, roverData} );
        }).catch(error => {
            alert(error.message);
        });
}

