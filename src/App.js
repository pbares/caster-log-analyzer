import React, { Component } from 'react';
import './App.css';
import { applyPredicatesOnText } from "./Util.js";
import { FILTERS } from './Filters.js'

/**
 * CheckBox. When it is checked, it calls this.props.onUpdatePredicateList to transmit 
 * the id of the checkbox plus its associated pattern
 */
class FilterCheckBox extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onUpdatePredicateList({
      id: this.props.value,
      pattern: this.props.pattern,
      color: this.props.color,
    });
  }

  render() {
    const inputProps = {
      onChange: this.handleChange,
      id: this.props.value,
      value: this.props.value,
      checked: this.props.checked,
    };

    return (
      <div className="FilterCheckBoxContainer">
        <input type="checkbox" {...inputProps}/>
        <label htmlFor={this.props.value}>
          <font color={this.props.color}>{this.props.value}</font>
        </label>
      </div>
    );
  }
}

/**
 * Container that stores the analyzed result 
 */
class ResultArea extends Component {
  render() {
    return (
      <div className="Result-area" dangerouslySetInnerHTML={{__html: this.props.value}}/>
    );
  }
}

class InputArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
    
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const currentText = event.target.value;
    this.setState({text: currentText});
  }

  clear() {
    this.setState({text: ''});
  }

  triggerAnalysis() {
    this.props.onUpdate(this.state.text);
  }

  toggleRemoveFilter() {
    this.props.onUpdatePredicateList(null);
  }
  
  render() {
    const filterCheckBoxes = FILTERS.map(f => {
        const inputProps = {
          onUpdatePredicateList: this.props.onUpdatePredicateList,
          key: f.value,
          value: f.value,
          pattern : f.pattern,
          color: f.color,
          checked: this.props.selectedItems.has(f.value),
        };

        return <FilterCheckBox {...inputProps}/>
    });
    
    return (
      <div>
        <textarea 
          className="textBox" 
          placeholder="copy/paste here the log to analyze"
          value={this.state.text}
          onChange={this.handleChange}
        />

        <div>
          <button className="Button" onClick={() => this.toggleRemoveFilter()}>Remove filters</button>
          <button className="Button" onClick={() => this.triggerAnalysis()}>Analyze</button>
          <button className="Button" onClick={() => this.clear()}>Clear</button>

          {filterCheckBoxes}
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      predicates: new Array(0),
    };
    this.update = this.update.bind(this);
    this.updatePredicateList = this.updatePredicateList.bind(this);
  }

  update(val) {
    this.setState({value: val});
  }

  /**
   * Updates the list of filters by appending the given predicate to the existing list. 
   * If null is passed as argument, it means 'no filter'.
   * 
   * @param {*} item 
   */
  updatePredicateList(item) {
    let predicates = [];
    if(item !== null){
      var found = false;
      predicates = this.state.predicates.slice();
      for(var i = 0; i < predicates.length; i++) {
        if(predicates[i].id === item.id) {
          // Remove it
          found = true;
          predicates.splice(i, 1);
          break;
        }
      }
  
      if(!found) {
        // Add it to the list
        predicates.push(item);
      }
    }
    this.setState({predicates: predicates});
  }

  render() {
    const result = applyPredicatesOnText(this.state.value, this.state.predicates);

    const selectedItems = new Set();
    this.state.predicates.map(p => selectedItems.add(p.id));

    return (
      <div className="App">
        <InputArea 
          onUpdate={this.update} 
          onUpdatePredicateList={this.updatePredicateList}
          selectedItems={selectedItems}/>
        <ResultArea value={result}/>
      </div>
    );
  }
}

export default App;