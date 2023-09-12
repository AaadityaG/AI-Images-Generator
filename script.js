const apiKey = "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";

const imageCount = 4;
let selectImageNumber = null;

// to generate random number between min and max
function getRandomNum(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function disableGenerateButton(){
    document.getElementById("generate").disable = true;
}

function enableGenerateButton(){
    document.getElementById("generate").disable = false;
}

function clearImageGrid(){
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}



// generate images
async function generateImages(input){
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];
    for(let i = 0; i<imageCount; i++){
        const randomNum = getRandomNum(1, 100);
        const prompt = `${input} ${randomNum}`;
        
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney-v4",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({inputs: prompt}),
            }
        )
        if(!response.ok){
            alert("Unable to generate images...");
        }

        const result = await response.blob();
        const imageUrl = URL.createObjectURL(result);
        imageUrls.push(imageUrl);
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imageUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }
    loading.style.display = "none";
    enableGenerateButton();
    
    selectImageNumber = null;
}


function downloadImage(imageUrl, imageNumbers){
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `image-${imageNumbers+1}.png`;
    link.click();
}


document.getElementById("generate").addEventListener('click', ()=>{
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
})
