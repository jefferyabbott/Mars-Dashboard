let store = {
    photos: [],
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

const displayRoverData = (rover) => {
    const rDisplay = document.getElementById('rover_display')
    rDisplay.innerText = rover
    loadRoverData(rover)
    ShowImages(store.photos)
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
    let { rovers, apod } = state

    return `
        <header>
            <h1>Mars Dashboard</h1>
            <hr/>
            <div>${roverLinks(rovers)}</div>
        </header>
        <hr/>
        <main>
            <div id="rover_display"></div>
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

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
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

const loadRoverData = (rover) => {
    let url = new URL(`http://localhost:3000/nasa?rover=${rover}`);
    fetch(url)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Oops! Something went wrong! Please try again.');
            }
        }).then(data => {
            const photos = data.roverData.photos.map((r) => {
                return r.img_src
            })
            // console.log(images)
            // const date = data.roverData[0].earth_date;
            // const { name, launch_date, landing_date, status } = data.roverData[0].rover;
            // const roverDetails = { date, rovername: name, launchDate: launch_date, landingDate: landing_date, status };
            // const roverObject = { photos: data.roverData, roverDetails }
            // const newState = store.set(photos);

            updateStore(store, {...store, photos} );
        }).catch(error => {
            alert(error.message);
        });
}

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    return data
}
