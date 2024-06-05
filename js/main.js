document.addEventListener("DOMContentLoaded", function() {
    fetch('json/links.json')
        .then(response => response.json())
        .then(data => {
            generateContent(data);
        })
        .catch(error => console.error('Error loading JSON:', error));
});

function generateContent(data) {
    const content = document.getElementById('content');
    data.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.name;
        categoryDiv.appendChild(categoryTitle);

        const linkList = document.createElement('ul');
        linkList.classList.add('link-list');

        category.links.forEach(link => {
            const linkItem = document.createElement('li');
            linkItem.classList.add('link-item');
            linkItem.setAttribute('data-tags', link.tags.join(', '));

            const linkAnchor = document.createElement('a');
            linkAnchor.href = link.url;
            linkAnchor.textContent = link.title;
            linkAnchor.target = "_blank";

            if (link.url.startsWith('http')) {
                const linkIcon = document.createElement('span');
                linkIcon.classList.add('link-icon');
                linkIcon.textContent = '🔗'; // Chainlink emoji for webpage links
                linkItem.appendChild(linkIcon);
            }

            linkItem.appendChild(linkAnchor);

            // Check for sublinks and create sublist
            if (link.sublinks) {
                const arrowIcon = document.createElement('span');
                arrowIcon.classList.add('arrow-icon', 'collapsed');
                arrowIcon.textContent = '▶'; // Right-pointing arrow

                linkAnchor.addEventListener('click', function(event) {
                    event.preventDefault(); // Prevent default link action
                    const subList = linkItem.querySelector('.sub-list');
                    if (subList) {
                        subList.classList.toggle('hidden');
                        if (subList.classList.contains('hidden')) {
                            arrowIcon.textContent = '▶'; // Right-pointing arrow
                        } else {
                            arrowIcon.textContent = '▼'; // Downward-pointing arrow
                        }
                    }
                });

                linkItem.insertBefore(arrowIcon, linkAnchor);

                const subList = document.createElement('ul');
                subList.classList.add('sub-list', 'hidden');

                link.sublinks.forEach(sublink => {
                    const sublinkItem = document.createElement('li');
                    sublinkItem.classList.add('link-item');
                    sublinkItem.setAttribute('data-tags', sublink.tags.join(', '));

                    const sublinkAnchor = document.createElement('a');
                    sublinkAnchor.href = sublink.url;
                    sublinkAnchor.textContent = sublink.title;
                    sublinkAnchor.target = "_blank";

                    sublinkItem.appendChild(sublinkAnchor);
                    subList.appendChild(sublinkItem);
                });

                linkItem.appendChild(subList);
            }

            linkList.appendChild(linkItem);
        });

        categoryDiv.appendChild(linkList);
        content.appendChild(categoryDiv);
    });
}

function searchLinks() {
    const input = document.getElementById('searchBar').value.toLowerCase();
    const linkItems = document.querySelectorAll('.link-item');
    
    linkItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const tags = item.getAttribute('data-tags').toLowerCase();
        const url = item.querySelector('a').href.toLowerCase();
        
        if (text.includes(input) || tags.includes(input) || url.includes(input)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}
