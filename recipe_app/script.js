import fetchData, {apiBaseUrl, categoriesEndPoint} from "./scripts/fetchData.js";
import   {readFromStorage, storageKeys, writeToStorage} from  "./scripts/storageControl.js"

const categgoriesFilterDiv = document.getElementById("detailed-categories-filter");


// tova go ima vyv fetchData
// const apiBaseUrl = `https://www.themealdb.com/api/json/v1/1` 
// const categoriesEndPoint = "/categories.php"

// async function fetchData(url){
//     try {
//        const response = await fetch(url);
//        const data = await response.json();
//        return data;

//     } catch (err){
//         console.log(err)
//     }
// }



function createCategoryElement(categoryObj){
    const { strCategory: title , strCategoryThumb: imgSrc } = categoryObj;

    const categoryDiv = document.createElement("div");
    categoryDiv.className = "category-box";


     const categoryThumb = document.createElement("img");

     categoryThumb.setAttribute("src", imgSrc);
     categoryThumb.setAttribute("alt", `${title} category image`)

     const categoryTitle = document.createElement("h4");
     categoryTitle.textContent = title;

     categoryDiv.appendChild(categoryThumb);
     categoryDiv.appendChild(categoryTitle);

     categoryDiv.appendChild(categoryThumb);

     return categoryDiv

}



async function main(){
  let categories = [];
  const { categories: fetchedCategories } = await fetchData(apiBaseUrl + categoriesEndPoint);
  readFromStorage(storageKeys.categories);
  if(!categories){
    const { categories: fetchedCategories } = await fetchData(apiBaseUrl + categoriesEndPoint);
  }
  categories = fetchedCategories;
  
  writeToStorage(storageKeys.categories, categories);
  
  categories.forEach(el => {
    const newCategoryEl =  createCategoryElement(el);
    categgoriesFilterDiv.appendChild(newCategoryEl);
    
  });
    
}


main();