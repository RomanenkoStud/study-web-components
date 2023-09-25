window.customElements.define(
    "menu-container",
    class extends HTMLElement {
        connectedCallback() {
            let tmpl = this.querySelector("template");
            tmpl.replaceWith(tmpl.content);
        }
});