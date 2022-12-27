import { LightningElement, wire, api, track } from "lwc";
import getPokemons from "@salesforce/apex/PokemonQuery.getPokemons";
import pokeSize from "@salesforce/apex/PokemonQuery.pokeSize";
import { NavigationMixin } from "lightning/navigation";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import TIPOS_FIELD from "@salesforce/schema/Pokemon__c.Tipos__c";

export default class ListaPokemons extends NavigationMixin (LightningElement) {

    @track data;
    numeroPokemons;
    doneTypingInterval = 0;
    TipoPickListValues;
    nombre = "";
    generacion = null;
    tipo = "";
    nombres = "";
    generaciones = null;
    tipos = "";

    @wire(getPokemons, {
        nombre: "$nombre",
        generacion: "$generacion",
        tipo: "$tipo",
    })
    pokeList;

    @wire(pokeSize, {
        nombres: "$nombres",
        generaciones: "$generaciones",
        tipos: "$tipos",
    })
    pokeSized;

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: TIPOS_FIELD
    })

    statusPickLists({ error, data }) {
        if (error) {
            console.error("error", error);
        } else if (data) {
            this.TipoPickListValues = [
                { label: "Todos", value: null },
                ...data.values
            ];
        }
    }

    get genOptions() {
        return [
            { label: 'Generacion 1', value: '1' },
            { label: 'Generacion 2', value: '2' },
            { label: 'Generacion 3', value: '3' },
            { label: 'Generacion 4', value: '4' },
            { label: 'Generacion 5', value: '5' },
            { label: 'Generacion 6', value: '6' },
            { label: 'Generacion 7', value: '7' },
            { label: 'Generacion 8', value: '8' },
            { label: 'Todos', value: 'null'}
        ];
    }

    handleGeneracionChange(event){
        this.generacion = this.generaciones = event.detail.value;
    }

    handleTipoChange(event) {
        let resultados = event.detail.value;
        let resultadosComoString = resultados.toString();
        let resultado = resultadosComoString.replace(",",";");
        this.tipo = this.tipos = resultado;
    }

    handleKeyUp(event) {
        clearTimeout(this.typingTimer);
        let value = event.target.value;
        this.typingTimer = setTimeout(() => {
            this.nombre = this.nombres = value;
        }, this.doneTypingInterval);
    }
    
    navigateToObjectPokemon(event) {
        const pokemonID = event.target.name;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: pokemonID,
                objectApiName: 'Pokemon__c',
                actionName: 'view'
            }
        });
    }
}