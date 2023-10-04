window.customElements.define(
    "menu-button",
    class extends HTMLElement {
        connectedCallback() {
            let tmpl = this.querySelector("template");
            tmpl.replaceWith(tmpl.content);
            const button = this.querySelector('.menu-toggle');
            const menuIcon = this.querySelector('.menu-icon');
            const crossIcon = this.querySelector('.cross-icon');

            const containerId = this.getAttribute("for-container");

            // Add a click event listener to toggle icons
            button.addEventListener('click', () => {
                menuIcon.classList.toggle("hidden");
                crossIcon.classList.toggle("hidden");

                const nav = document.querySelector(`#${containerId} > nav`);
                nav.classList.toggle("h-0");
                nav.classList.toggle("h-full");
            });
        }
});