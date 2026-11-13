'use strict';
(()=>{
 const section=document.getElementById('my-tours-pilot'),select=document.getElementById('my-tour-select'),content=document.getElementById('my-tour-content');
 if(!section||!select||!content)return;
 const tours=[...section.querySelectorAll('details[data-tour]')];
 function place(){const current=tours.find(node=>node.dataset.tour===select.value);if(current)current.querySelector('.tour-association-content').append(content);}
 tours.forEach(tour=>tour.addEventListener('toggle',()=>{if(!tour.open)return;tours.forEach(other=>{if(other!==tour)other.open=false;});const changed=select.value!==tour.dataset.tour;select.value=tour.dataset.tour;place();if(changed)select.dispatchEvent(new Event('change',{bubbles:true}));}));
 select.addEventListener('change',place);place();
})();
