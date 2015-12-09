import * as React from "react";
import * as _ from "lodash";
import * as classNames from 'classnames';
import {
	SearchkitComponent,
  HierarchicalFacetAccessor
} from "../../../../../core"

require("./../styles/index.scss");

export interface IHierarchicalMenuFilter {
	id:string
	fields:Array<string>
	title:string
}

export class HierarchicalMenuFilter extends SearchkitComponent<IHierarchicalMenuFilter, any> {
	public accessor:HierarchicalFacetAccessor

	constructor(props:IHierarchicalMenuFilter) {
		super(props)
	}

	shouldCreateNewSearcher() {
		return true;
	}

	defineAccessor() {
		return new HierarchicalFacetAccessor(
			this.props.id,
			{title:this.props.title, fields:this.props.fields}
		)
	}

	addFilter(option, level) {
		this.accessor.state.clear(level);
		this.accessor.state.add(level, option.key);
		this.searchkit.performSearch()
	}

	renderOption(level, option) {

		var className = classNames({
			"selected":this.accessor.state.contains(level, option.key)
		})

		return (
			<div>
				<div className={className} key={option.key} onClick={this.addFilter.bind(this, option,level)}>{option.key} ({option.doc_count})</div>
				<div>
					{(() => {
						if(this.accessor.state.contains(level,option.key)) {
							return this.renderOptions(level+1);
						}
					})()}
				</div>
			</div>
		)
	}

	renderOptions(level) {
		return (
			<div className="hierarchical-options">
			{_.map(this.accessor.getBuckets(level), this.renderOption.bind(this,level))}
			</div>
		)
	}

  render(){
    return (
			<div>
				<div className="title">{this.props.title}</div>
				{this.renderOptions(0)}
			</div>
		)
	}

}
