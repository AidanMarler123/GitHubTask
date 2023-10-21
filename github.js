"use strict"

window.addEventListener("load", () => {
    // Add an event listener to the button
    document.querySelector("#fetch").addEventListener("click", (evt) => {
        evt.preventDefault();

        const username = document.querySelector("#Username").value;
        const token = document.querySelector("#Token").value;
        const url_temp = `https://api.github.com/users/${username}`;

        // Send an authorization header with your token
        fetch(url_temp, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`GitHub API request failed: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Fetch the repositories for the user
                return fetch(data.repos_url);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`GitHub API request for repositories failed: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(repos => {
                // Call a function to display the user data and repositories
                displayData(username, repos);
            })
            .catch(error => {
                console.error('Error fetching or processing data:', error);
            });
    });
});

function displayData(username, repositories) {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = ''; // Clear previous data

    const header = document.createElement('h2');
    header.textContent = `GitHub Profile for ${username}`
    dataContainer.appendChild(header);

    const link = document.createElement('a');
    link.textContent = `${username}`;
    link.href = `https://github.com/${username}`;
    link.target = "_blank";
    dataContainer.appendChild(link);

    // Display the repositories as a list
    const ul = document.createElement('ul');

    repositories.forEach(repo => {
        const li = document.createElement('li');
        li.textContent = `${repo.name}: `;

        // Create a link for each repository
        const repoLink = document.createElement('a');
        repoLink.textContent = repo.name;

        repoLink.href = repo.html_url; // Set the GitHub repository URL
        repoLink.target = "_blank"; // Open in a new tab/window

        li.appendChild(repoLink);
        ul.appendChild(li);
    });

    dataContainer.appendChild(ul);
}
