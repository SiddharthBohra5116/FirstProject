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
    console.log("div is clicked");
    const category = filterDiv.getAttribute("data-category"); // Get the category from data-category attribute
    console.log(category); // Just for testing, you can remove this line
    // Send a request using fetch API or XMLHttpRequest
    window.location.href = `/listings/category/${category}`;
  });
}
