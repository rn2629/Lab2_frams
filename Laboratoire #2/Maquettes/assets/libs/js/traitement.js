const Liste = { template: '#liste' };
const Produit = { template: '#produit' };
const Ajout = { template: '#ajout' };
const Modification = { template: '#modification' };

const routes = [
    { path: '/liste', component: Liste },
    { path: '/produit', component: Produit },
    { path: '/ajout', component: Ajout },
    { path: '/modification', component: Modification }
];

const router = new VueRouter({
    routes
});

const app = new Vue({
    router
}).$mount('#app');