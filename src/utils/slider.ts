export function setUpScript() {
    const slider = getSlider();
    if (!slider) {
        console.error("No se encontró el slider");
        return;
    }
    const childSliders = getChildsSlider(slider);
    assingIdentifiers(childSliders);
    const prevButton = document.querySelector<HTMLButtonElement>("[data-button='prev']");
    const nextButton = document.querySelector<HTMLButtonElement>("[data-button='next']");

    if (prevButton) {
        addEventListener(slider, prevButton, childSliders, -1); // Botón izquierdo (retroceder)
    }
    if (nextButton) {
        addEventListener(slider, nextButton, childSliders, 1); // Botón derecho (avanzar)
    }
}

function getSlider(): HTMLElement | null {
    return document.querySelector<HTMLElement>("#slider");
}

function getChildsSlider(slider: HTMLElement | null = null): HTMLElement[] {
    return slider ? Array.from(slider.querySelectorAll<HTMLElement>("figure")) : [];
}

function assingIdentifiers(childsSlider: HTMLElement[]) {
    childsSlider.forEach((child, index) => {
        child.dataset.idSlider = index.toString();
    });
}

// Función para obtener el elemento activo
function getCurrentImage(slider: HTMLElement): HTMLElement | null {
    return slider.querySelector<HTMLElement>("[data-active]") || null;
}

// Función para eliminar el atributo "data-active" del elemento actual
function removeActiveElement(slider: HTMLElement): void {
    const currentImage = getCurrentImage(slider);
    if (currentImage) {
        currentImage.removeAttribute("data-active");
    }
}

// Función para agregar el atributo "data-active" a un nuevo elemento
function addNewActiveElement(element: HTMLElement): void {
    element.setAttribute("data-active", "");
}

// Función para agregar eventos a los botones
function addEventListener(
    slider: HTMLElement,
    button: HTMLButtonElement,
    childsSlider: HTMLElement[],
    step: number
): void {
    button.addEventListener("click", () => {
        const currentImage = getCurrentImage(slider);
        if (!currentImage) return;

        const lengthImages = childsSlider.length;
        const currentActiveIndex = parseInt(currentImage.dataset.idSlider || "0", 10);
        let newActiveIndex = currentActiveIndex + step;

        if (newActiveIndex < 0) {
            newActiveIndex = lengthImages - 1; 
        } else if (newActiveIndex >= lengthImages) {
            newActiveIndex = 0; 
        }

        const newActiveElement = childsSlider[newActiveIndex];

        removeActiveElement(slider);
        addNewActiveElement(newActiveElement);
        newActiveElement.getBoundingClientRect();
    });
}