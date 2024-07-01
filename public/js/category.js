let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (let info of taxInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});
const filterDivs = document.getElementsByClassName("filter");
for (let filterDiv of filterDivs) {
  filterDiv.addEventListener("click", () => {
    const category = filterDiv.getAttribute("data-category"); // Get the category from data-category attribute
    // Send a request using fetch API or XMLHttpRequest
    window.location.href = `/listings/category/${category}`;
  });
}
