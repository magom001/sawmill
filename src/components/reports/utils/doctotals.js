import React, { Component } from 'react';
import _ from 'lodash';

class DocTotals extends Component {

  render() {

    let totals = this.props.data.map(v => ({item: `${v.stackByStackid.dimensionByDimensionid.thicknessMm}*${v.stackByStackid.dimensionByDimensionid.widthMm}*${v.stackByStackid.lengthByLengthid.lengthMm}`, quantity: v.quantity, vol: v.stackVol}));
    totals = _(totals)
      .groupBy('item')
      .map((objs, key) => ({
        'item': key,
        'vol': _.sumBy(objs, 'vol'),
        'quantity': _.sumBy(objs, 'quantity')
      })).value();

    totals.total = totals.reduce((p,c) => ({
      vol:parseFloat(p.vol)+parseFloat(c.vol),
      quantity: parseInt(p.quantity,10)+parseInt(c.quantity,10)
    }), {vol:0, quantity:0});
    return (
      <div>
        Количество выпущенных штабелей: {this.props.data.length} | кол-во: {totals.total.quantity}  шт. | объем: {totals.total.vol.toFixed(3)} куб.м
        <ul>
          {_.orderBy(totals, 'item', 'asc').map((v,i) => {return <li key={i}>{v.item} - {v.vol.toFixed(3)} куб.м</li>})}
        </ul>
      </div>
    );
  }

}

export default DocTotals;
