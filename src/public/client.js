let store = {
  selectedRover: '',
  roverData: Immutable.Map({
    Curiosity: {},
    Opportunity: {},
    Spirit: {},
  }),
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (state, newState) => {
  store = state.merge(newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

const displayRoverData = (rover) => {
  const allRovers = document.querySelectorAll('.roverLabel');
  allRovers.forEach((r) => {
    r.classList.remove('seletedRover');
  });

  store.selectedRover = rover;
  loadRoverImages(rover);
};

// generate menu
const roverLinks = (rovers) => {
  let roverList = '';
  rovers.forEach((r) => {
    roverList += `<li onclick="displayRoverData('${r}')"><p class="dropdown-item">${r}</p></li>`;
  });
  return roverList;
};

// create content
const App = (state) => {
  const { selectedRover } = state;
  const roverData = state.roverData.get(selectedRover);
  const [...rovers] = state.roverData.keys();
  console.log('Found Rovers:');
  console.log(rovers);
  const page =
    header(rovers) + '<hr/>' + roverDetails(selectedRover, roverData);
  return page;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

const header = (rovers) => {
  return `
        <header>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Mars Dashboard</a>

                <div class="navbar-collapse" id="navbarNavDarkDropdown">
                  <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                      <a class="nav-link dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Rovers
                      </a>
                      <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                        ${roverLinks(rovers)}
                    </li>
                  </ul>
              </div>
            </div>
          </nav>
        </header>`;
};

const roverDetails = (selectedRover, roverData) => {
  if (!roverData) {
    return `<div>Please select a rover.</div>`;
  }
  return `
        <hr/>
        <main>
            ${showImages(store.roverData.get(selectedRover))}
        </main>`;
};

const showImages = (roverData) => {
  let imageContent = `<div class="container">
          <div>
              <h1>${roverData[0].rover.name}</h1>
              <table class="table">
                  <tr>
                      <td>Launch date</td>
                      <td>${roverData[0].rover.launch_date}</td>
                  </tr>
                  <tr>
                      <td>Landing date</td>
                      <td>${roverData[0].rover.landing_date}</td>
                  </tr>
                  <tr>
                      <td>Photo date</td>
                      <td>${roverData[0].earth_date}</td>
                  </tr>
                  <tr>
                      <td>Status</td>
                      <td>${roverData[0].rover.status}</td>
                  </tr>
              </table>
          </div>
          <div class="row">`;

  roverData.forEach((r) => {
    imageContent += `<div class="col-lg-4 align-self-end">
          <img src="${r.img_src}" class="roverImg mx-auto d-block" alt="...">
          <p class="cameraName">${r.camera.full_name}</p>
        </div>`;
  });
  imageContent += `
      </div></div>`;
  return imageContent;
};

// ------------------------------------------------------  API CALLS

const loadRoverImages = (rover) => {
  let url = new URL(`http://localhost:3000/nasa?rover=${rover}`);
  fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('Error while requesting rover data');
      }
    })
    .then((data) => {
      const roverData = data.roverData.latest_photos;
      const newState = store
        .set('selectedRover', rover)
        .setIn([roverData, `${rover}`], roverData);
      updateStore(store, newState);
    })
    .catch((error) => {
      alert(error.message);
    });
};
