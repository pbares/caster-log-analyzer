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
    return (
      <div className="FilterCheckBoxContainer">
        <input type="checkbox" id={this.props.value} value={this.props.value} onChange={this.handleChange}/>
        <label htmlFor={this.props.value}>
          <font color={this.props.color}>{this.props.value}</font>
        </label>
      </div>
    );
  }
}

/**
 * Container to store the analyzed result 
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
    this.setState({text: ""});
  }

  triggerAnalysis() {
    this.props.onUpdate(this.state.text);
  }
  
  render() {
    const filterCheckBoxes = FILTERS.map(f => 
       <FilterCheckBox onUpdatePredicateList={this.props.onUpdatePredicateList} 
            value={f.value} pattern={f.pattern} color={f.color}/>
    );

    return (
      <div>
        <textarea 
          className="textBox" 
          placeholder="log to analyze"
          value={this.state.text}
          onChange={this.handleChange}
        />

        <div>
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

  updatePredicateList(item) {
    var found = false;
    const predicates = this.state.predicates.slice();
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
    this.setState({predicates: predicates});
  }

  render() {
    const result = applyPredicatesOnText(this.state.value, this.state.predicates);

    return (
      <div className="App">
        {/* <header className="App-header">
          <h1 className="App-title">Caster log analyzer</h1>
        </header> */}
        <InputArea onUpdate={this.update} onUpdatePredicateList={this.updatePredicateList}/>
        <ResultArea value={result}/>
      </div>
    );
  }
}

export default App;