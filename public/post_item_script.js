import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import imageCompression from 'https://cdn.jsdelivr.net/npm/browser-image-compression/+esm';

const supabase = createClient(
    'https://wuhgqjeijmxsgvnykttj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1aGdxamVpam14c2d2bnlrdHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjkzMDQsImV4cCI6MjA1ODQwNTMwNH0._lZy7CE2A8HM1hatjGYrMR8QAUi8nk4L_EuV7Fojhw'
);

let photos = [];

async function deleteFileFromSupabase(filePath) {
    const { error } = await supabase.storage
        .from('item-photos')
        .remove([filePath]);

    if (error) {
        console.error('Error deleting file from Supabase:', error);
        alert('Failed to delete file from storage.');
    } else {
        console.log('File deleted successfully from Supabase:', filePath);
    }
}

document.getElementById('file-upload').addEventListener('change', async function (event) {
    const files = event.target.files;
    const previewContainer = document.getElementById('image-preview');
    previewContainer.innerHTML = '';
    photos = [];

    for (const file of files) {
        const filePath = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('item-photos')
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
            continue;
        }

        const publicURL = `https://wuhgqjeijmxsgvnykttj.supabase.co/storage/v1/object/public/item-photos/${filePath}`;

        // Add the uploaded photo to the preview with delete button
        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';

        const img = document.createElement('img');
        img.src = publicURL;
        img.className = 'w-24 h-24 object-cover rounded border border-gray-300';

        const deleteButton = document.createElement('div');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '&times;';
        deleteButton.onclick = async () => {
            await deleteFileFromSupabase(filePath);
            photos = photos.filter((p) => p !== publicURL);
            imgContainer.remove();
        };

        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteButton);
        previewContainer.appendChild(imgContainer);

        photos.push(publicURL);
    }
});

document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const studId = sessionStorage.getItem('stud_id');
    if (!studId) {
        alert('Student ID not found. Please log in again.');
        return;
    }

    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerText = 'Posting...';

    const priceType = document.querySelector('input[name="price_type"]:checked').value;

    let itemPrice = null;
    let itemPriceMin = null;
    let itemPriceMax = null;

    if (priceType === 'single') {
        itemPrice = document.getElementById('price').value.trim();
        if (itemPrice === '' || isNaN(itemPrice)) {
            alert('Please enter a valid price.');
            submitButton.disabled = false;
            submitButton.innerText = 'Post';
            return;
        }
    } else if (priceType === 'range') {
        itemPriceMin = document.getElementById('price_min').value.trim();
        itemPriceMax = document.getElementById('price_max').value.trim();
        if (
            itemPriceMin === '' || isNaN(itemPriceMin) ||
            itemPriceMax === '' || isNaN(itemPriceMax)
        ) {
            alert('Please enter valid minimum and maximum prices.');
            submitButton.disabled = false;
            submitButton.innerText = 'Post';
            return;
        }
        if (parseFloat(itemPriceMin) > parseFloat(itemPriceMax)) {
            alert('Minimum price cannot be greater than maximum price.');
            submitButton.disabled = false;
            submitButton.innerText = 'Post';
            return;
        }
    } else if (priceType === 'hidden') {
        // No price needed
    }

    const payload = {
        stud_id: studId,
        item_name: document.getElementById('title').value,
        meeting_place: document.getElementById('meeting_place').value,
        item_description: document.getElementById('description').value,
        item_price_type: priceType,
        item_price: itemPrice,
        item_price_min: itemPriceMin,
        item_price_max: itemPriceMax,
        item_condition: document.getElementById('condition').value,
        item_type: document.getElementById('item_type').value,
        photos: photos,
    };

    try {
        const response = await fetch('/post-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.success) {
            alert('Item posted successfully!');
            event.target.reset();
            document.getElementById('image-preview').innerHTML = '';
            photos = [];
        } else {
            alert('Failed to post item: ' + result.message);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }

    submitButton.disabled = false;
    submitButton.innerText = 'Post';
});
