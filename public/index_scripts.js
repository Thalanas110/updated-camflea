// CamFlea Index Page JavaScript
// Modern, clean, and modular implementation

class CamFlealApp {
    constructor() {
        // Configuration
        this.config = {
            supabase: {
                url: 'https://wuhgqjeijmxsgvnykttj.supabase.co',
                key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1aGdxamVpam14c2d2bnlrdHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjkzMDQsImV4cCI6MjA1ODQwNTMwNH0._lZy7CE2A8HM1hatjGYrMR8QAUi8nk4L_EuV7Fojhwg'
            },
            itemsPerPage: 20,
            updateInterval: 60000 // 1 minute
        };

        // State
        this.state = {
            currentPage: 1,
            totalPages: 1,
            searchQuery: '',
            filters: {
                priceMin: '',
                priceMax: '',
                rating: '',
                sort: 'newest',
                school: '',
                condition: '',
                itemTypes: []
            },
            isLoading: false,
            items: [],
            notificationCount: 0
        };

        // Initialize
        this.init();
    }

    // Initialization
    async init() {
        try {
            // Check if user is logged in
            const studId = localStorage.getItem('stud_id');
            if (!studId) {
                console.warn('No user logged in, redirecting to login');
                window.location.href = 'Login_page.html';
                return;
            }

            this.setupSupabase();
            this.setupEventListeners();
            this.restoreState();
            await this.loadItems();
            this.setupRealtimeSubscriptions();
            this.startTimeUpdates();
            this.hideLoader();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize the application');
        }
    }

    setupSupabase() {
        // Check if supabase is available globally
        if (typeof window.supabase === 'undefined') {
            console.error('Supabase library not loaded');
            this.showError('Failed to connect to database. Please refresh the page.');
            return;
        }
        
        try {
            this.supabase = window.supabase.createClient(this.config.supabase.url, this.config.supabase.key);
            console.log('Supabase client initialized successfully');
        } catch (error) {
            console.error('Error initializing Supabase:', error);
            this.showError('Failed to connect to database.');
        }
    }

    setupEventListeners() {
        // Search functionality
        this.setupSearchListeners();
        
        // Filter functionality
        this.setupFilterListeners();
        
        // Navigation functionality
        this.setupNavigationListeners();
        
        // Modal functionality
        this.setupModalListeners();
        
        // Panel functionality
        this.setupPanelListeners();
    }

    setupSearchListeners() {
        const searchInput = document.querySelector('.search-input');
        const searchIcon = document.querySelector('.search-icon');
        const dropdown = document.getElementById('recent-searches-dropdown');

        if (!searchInput) return;

        // Search input events
        searchInput.addEventListener('input', this.debounce((e) => {
            this.state.searchQuery = e.target.value.trim();
            localStorage.setItem('currentSearchQuery', this.state.searchQuery);
            
            if (this.state.searchQuery === '') {
                this.loadItems();
            }
        }, 300));

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
                searchInput.blur();
            }
        });

        searchInput.addEventListener('click', () => {
            if (searchInput.value.length > 0) {
                searchInput.select();
            }
            this.showRecentSearches();
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 200);
        });

        // Search icon click
        if (searchIcon) {
            searchIcon.addEventListener('click', () => {
                this.performSearch();
            });
        }
    }

    setupFilterListeners() {
        // Price filter
        const applyPriceBtn = document.getElementById('apply-price-filter');
        if (applyPriceBtn) {
            applyPriceBtn.addEventListener('click', () => {
                this.applyPriceFilter();
            });
        }

        // Other filters
        const filterSelects = ['rating-filter', 'sort-filter', 'school-filter', 'condition-filter'];
        filterSelects.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    const filterType = id.replace('-filter', '');
                    this.state.filters[filterType] = e.target.value;
                    this.saveFilterState();
                    this.loadItems();
                });
            }
        });

        // Item type checkboxes
        const checkboxes = document.querySelectorAll('.item-type-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateItemTypeFilters();
            });
        });

        // Custom select styling
        this.setupCustomSelects();
    }

    setupNavigationListeners() {
        // Mobile sidebar functionality
        this.setupMobileSidebar();
        
        // Action buttons
        const actionButtons = {
            'transactionFloatBtn': 'transactionPanel',
            'notificationsFloatBtn': 'notificationPanel',
            'myConversationsBtn': 'conversationPanel',
            // Mobile buttons
            'mobileTransactionBtn': 'transactionPanel',
            'mobileNotificationsBtn': 'notificationPanel',
            'mobileConversationsBtn': 'conversationPanel'
        };

        Object.entries(actionButtons).forEach(([btnId, panelId]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.togglePanel(panelId);
                    // Close mobile sidebar if open
                    this.closeMobileSidebar();
                });
            }
        });

        // Pagination
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.state.currentPage > 1) {
                    this.state.currentPage--;
                    this.loadItems();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.state.currentPage < this.state.totalPages) {
                    this.state.currentPage++;
                    this.loadItems();
                }
            });
        }
    }

    setupMobileSidebar() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileSidebar = document.getElementById('mobileSidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const mobileSidebarClose = document.getElementById('mobileSidebarClose');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.openMobileSidebar();
            });
        }

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => {
                this.closeMobileSidebar();
            });
        }

        if (mobileSidebarClose) {
            mobileSidebarClose.addEventListener('click', () => {
                this.closeMobileSidebar();
            });
        }

        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileSidebar();
            }
        });
    }

    openMobileSidebar() {
        const mobileSidebar = document.getElementById('mobileSidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');
        
        if (mobileSidebar && mobileOverlay) {
            mobileSidebar.classList.add('open');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }

    closeMobileSidebar() {
        const mobileSidebar = document.getElementById('mobileSidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');
        
        if (mobileSidebar && mobileOverlay) {
            mobileSidebar.classList.remove('open');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    setupModalListeners() {
        // Detailed post modal
        const closeBtn = document.getElementById('closeDetailedPostModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal('detailedPostModal');
            });
        }

        // Image zoom modal
        const imageZoomModal = document.getElementById('imageZoomModal');
        if (imageZoomModal) {
            imageZoomModal.addEventListener('click', (e) => {
                if (e.target === imageZoomModal) {
                    this.closeModal('imageZoomModal');
                }
            });
        }

        // Window message handler for iframes
        window.addEventListener('message', (event) => {
            this.handleWindowMessage(event);
        });
    }

    setupPanelListeners() {
        // Close panels when clicking outside
        document.addEventListener('click', (e) => {
            const panels = document.querySelectorAll('.side-panel.open');
            panels.forEach(panel => {
                if (!panel.contains(e.target) && !this.isActionButton(e.target)) {
                    panel.classList.remove('open');
                }
            });
        });
    }

    // Search functionality
    performSearch() {
        if (this.state.searchQuery.trim()) {
            this.saveRecentSearch(this.state.searchQuery);
        }
        this.state.currentPage = 1;
        this.loadItems();
    }

    showRecentSearches() {
        const dropdown = document.getElementById('recent-searches-dropdown');
        const searches = this.getRecentSearches();
        
        if (searches.length === 0) {
            dropdown.style.display = 'none';
            return;
        }

        dropdown.innerHTML = '';
        searches.forEach(term => {
            const item = this.createRecentSearchItem(term);
            dropdown.appendChild(item);
        });
        dropdown.style.display = 'block';
    }

    createRecentSearchItem(term) {
        const item = document.createElement('div');
        item.className = 'recent-search-item';

        const termSpan = document.createElement('span');
        termSpan.textContent = term;
        termSpan.style.cursor = 'pointer';
        termSpan.style.flexGrow = '1';
        termSpan.addEventListener('click', () => {
            const searchInput = document.querySelector('.search-input');
            searchInput.value = term;
            this.state.searchQuery = term;
            localStorage.setItem('currentSearchQuery', term);
            document.getElementById('recent-searches-dropdown').style.display = 'none';
            this.loadItems();
            searchInput.blur();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-search-btn';
        deleteBtn.title = 'Delete this search';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteRecentSearch(term);
            this.showRecentSearches();
        });

        item.appendChild(termSpan);
        item.appendChild(deleteBtn);
        return item;
    }

    saveRecentSearch(searchTerm) {
        if (!searchTerm) return;
        const studId = localStorage.getItem('stud_id') || 'guest';
        const key = `recentSearches_${studId}`;
        let searches = this.getRecentSearches();
        
        searches = searches.filter(term => term.toLowerCase() !== searchTerm.toLowerCase());
        searches.unshift(searchTerm);
        
        if (searches.length > 5) {
            searches = searches.slice(0, 5);
        }
        localStorage.setItem(key, JSON.stringify(searches));
    }

    getRecentSearches() {
        const studId = localStorage.getItem('stud_id') || 'guest';
        const key = `recentSearches_${studId}`;
        const searches = localStorage.getItem(key);
        return searches ? JSON.parse(searches) : [];
    }

    deleteRecentSearch(term) {
        const studId = localStorage.getItem('stud_id') || 'guest';
        const key = `recentSearches_${studId}`;
        const searches = this.getRecentSearches().filter(s => 
            s.toLowerCase() !== term.toLowerCase()
        );
        localStorage.setItem(key, JSON.stringify(searches));
    }

    // Filter functionality
    applyPriceFilter() {
        const minInput = document.getElementById('price-min');
        const maxInput = document.getElementById('price-max');
        
        const minVal = minInput?.value.trim() || '';
        const maxVal = maxInput?.value.trim() || '';

        if (minVal === '' && maxVal === '') {
            this.state.filters.priceMin = '';
            this.state.filters.priceMax = '';
        } else {
            const min = minVal === '' ? 0 : parseFloat(minVal);
            const max = maxVal === '' ? Number.MAX_VALUE : parseFloat(maxVal);

            if (isNaN(min) || isNaN(max)) return;
            if (min > max) {
                this.showNoItemsMessage();
                return;
            }

            this.state.filters.priceMin = minVal;
            this.state.filters.priceMax = maxVal;
        }

        this.saveFilterState();
        this.state.currentPage = 1;
        this.loadItems();
    }

    updateItemTypeFilters() {
        const checkboxes = document.querySelectorAll('.item-type-checkbox');
        const selectedTypes = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedTypes.push(checkbox.value);
            }
        });

        this.state.filters.itemTypes = selectedTypes;
        this.saveFilterState();
        this.state.currentPage = 1;
        this.loadItems();
    }

    setupCustomSelects() {
        const customSelects = [
            { id: 'rating-filter', styledId: 'rating-filter-styled' },
            { id: 'sort-filter', styledId: 'sort-filter-styled' },
            { id: 'school-filter', styledId: 'school-filter-styled' },
            { id: 'condition-filter', styledId: 'condition-filter-styled' }
        ];

        customSelects.forEach(selectData => {
            const selectElement = document.getElementById(selectData.id);
            const styledElement = document.getElementById(selectData.styledId);

            if (selectElement && styledElement) {
                styledElement.textContent = selectElement.options[selectElement.selectedIndex]?.text || '';
                
                selectElement.addEventListener('change', () => {
                    styledElement.textContent = selectElement.options[selectElement.selectedIndex]?.text || '';
                });
            }
        });
    }

    // Data loading and display
    async loadItems() {
        if (this.state.isLoading) return;
        
        this.state.isLoading = true;
        this.showLoadingState();

        try {
            if (!this.supabase) {
                throw new Error('Supabase client not initialized');
            }

            const { data: items, error, count } = await this.fetchItems();
            
            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            this.state.items = items || [];
            this.state.totalPages = Math.ceil((count || 0) / this.config.itemsPerPage);
            
            console.log(`Loaded ${this.state.items.length} items`);
            await this.displayItems();
            this.updatePagination();
            
        } catch (error) {
            console.error('Error loading items:', error);
            this.showError(`Failed to load items: ${error.message}`);
        } finally {
            this.state.isLoading = false;
        }
    }

    async fetchItems() {
        try {
            // Build query - using the same structure as original
            let query = this.supabase
                .from('item')
                .select(`
                    item_id,
                    item_name,
                    item_description,
                    item_condition,
                    item_status,
                    item_type,
                    item_price_type,
                    item_price_min,
                    item_price_max,
                    item_price,
                    photos,
                    created_at,
                    stud_id,
                    student:stud_id (
                        stud_school
                    )
                `, { count: 'exact' })
                .eq('item_status', 'available');

            // Apply search filter
            if (this.state.searchQuery) {
                query = query.ilike('item_name', `%${this.state.searchQuery}%`);
            }

            // Apply price filter
            if (this.state.filters.priceMin) {
                query = query.gte('item_price', parseFloat(this.state.filters.priceMin));
            }
            if (this.state.filters.priceMax) {
                query = query.lte('item_price', parseFloat(this.state.filters.priceMax));
            }

            // Apply other filters
            if (this.state.filters.school) {
                query = query.eq('student.stud_school', this.state.filters.school);
            }

            if (this.state.filters.condition) {
                query = query.eq('item_condition', this.state.filters.condition);
            }

            if (this.state.filters.itemTypes.length > 0) {
                query = query.in('item_type', this.state.filters.itemTypes);
            }

            // Apply sorting
            switch (this.state.filters.sort) {
                case 'price-low-high':
                    query = query.order('item_price', { ascending: true });
                    break;
                case 'price-high-low':
                    query = query.order('item_price', { ascending: false });
                    break;
                case 'newest':
                default:
                    query = query.order('created_at', { ascending: false });
                    break;
            }

            // Apply pagination
            const from = (this.state.currentPage - 1) * this.config.itemsPerPage;
            const to = from + this.config.itemsPerPage - 1;
            query = query.range(from, to);

            return await query;
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    }

    async displayItems() {
        const container = document.getElementById('items-container');
        if (!container) return;

        if (this.state.items.length === 0) {
            this.showNoItemsMessage();
            return;
        }

        // Get seller ratings for all items
        const itemsWithRatings = await this.enrichItemsWithRatings(this.state.items);

        container.innerHTML = '';
        itemsWithRatings.forEach(item => {
            const itemCard = this.createItemCard(item);
            container.appendChild(itemCard);
        });
    }

    async enrichItemsWithRatings(items) {
        const sellerIds = [...new Set(items.map(item => item.stud_id))];
        const ratings = await this.fetchSellerRatings(sellerIds);

        return items.map(item => ({
            ...item,
            sellerRating: ratings[item.stud_id] || { average: 0, count: 0 }
        }));
    }

    async fetchSellerRatings(sellerIds) {
        try {
            const { data: feedbacks, error } = await this.supabase
                .from('feedback')
                .select('seller_id, stars')
                .in('seller_id', sellerIds);

            if (error) throw error;

            const ratings = {};
            feedbacks?.forEach(feedback => {
                if (!ratings[feedback.seller_id]) {
                    ratings[feedback.seller_id] = { total: 0, count: 0 };
                }
                ratings[feedback.seller_id].total += feedback.stars;
                ratings[feedback.seller_id].count += 1;
            });

            // Calculate averages
            Object.keys(ratings).forEach(sellerId => {
                const rating = ratings[sellerId];
                rating.average = rating.count > 0 ? rating.total / rating.count : 0;
            });

            return ratings;
        } catch (error) {
            console.error('Error fetching seller ratings:', error);
            return {};
        }
    }

    createItemCard(item) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.dataset.itemId = item.item_id;

        const photoUrl = item.photos?.[0] || 'https://via.placeholder.com/250x200?text=No+Image';
        const timePosted = this.formatTimeAgo(item.created_at);
        const priceDisplay = this.formatPrice(item);
        const rating = item.sellerRating?.average || 0;
        const ratingCount = item.sellerRating?.count || 0;

        card.innerHTML = `
            <img src="${photoUrl}" alt="${this.escapeHtml(item.item_name)}" class="item-image">
            <div class="item-content">
                <h3 class="item-title">${this.escapeHtml(item.item_name)}</h3>
                <div class="price-time-row">
                    <span class="item-price">${priceDisplay}</span>
                    <span class="time-ago" data-created-at="${item.created_at}">${timePosted}</span>
                </div>
                <div class="item-condition">${this.escapeHtml(item.item_condition)}</div>
                <div class="rating-status-row">
                    <span class="item-rating">
                        <i class="fas fa-star"></i> ${rating.toFixed(1)} (${ratingCount})
                    </span>
                    <span class="item-status status-${item.item_status}">
                        ${this.capitalizeFirst(item.item_status)}
                    </span>
                </div>
                <div class="school-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${this.escapeHtml(item.student?.stud_school || 'Unknown School')}</span>
                </div>
            </div>
        `;

        // Add click handler
        card.addEventListener('click', () => {
            this.openItemDetails(item.item_id);
        });

        return card;
    }

    formatPrice(item) {
        if (item.item_price_type === 'single') {
            return `PHP${this.formatNumberWithCommas(item.item_price)}`;
        } else if (item.item_price_type === 'range') {
            return `PHP${this.formatNumberWithCommas(item.item_price_min)} - PHP${this.formatNumberWithCommas(item.item_price_max)}`;
        } else if (item.item_price_type === 'hidden') {
            return 'Price hidden';
        } else {
            return 'Price not available';
        }
    }

    formatNumberWithCommas(number) {
        if (number == null || number === '') return number;
        return parseFloat(number).toLocaleString();
    }

    formatTimeAgo(createdAt) {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInSeconds = Math.floor((now - createdDate) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
        }

        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) {
            return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
    }

    // Panel management
    togglePanel(panelId) {
        const panel = document.getElementById(panelId);
        if (!panel) return;

        // Close other panels
        document.querySelectorAll('.side-panel').forEach(p => {
            if (p.id !== panelId && p.classList.contains('open')) {
                p.classList.remove('open');
            }
        });

        // Toggle current panel
        panel.classList.toggle('open');
        
        // Update notification count if opening notification panel
        if (panelId === 'notificationPanel' && panel.classList.contains('open')) {
            this.updateNotificationBadge();
        }
    }

    // Modal management
    openItemDetails(itemId) {
        const modal = document.getElementById('detailedPostModal');
        const iframe = document.getElementById('detailedPostIframe');
        
        if (modal && iframe) {
            iframe.src = `Detailed_post.html?item_id=${itemId}&embedded=1`;
            modal.style.display = 'flex';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            if (modalId === 'detailedPostModal') {
                const iframe = document.getElementById('detailedPostIframe');
                if (iframe) iframe.src = '';
            }
            if (modalId === 'imageZoomModal') {
                const img = document.getElementById('zoomedImage');
                if (img) img.src = '';
            }
        }
    }

    handleWindowMessage(event) {
        if (event.data?.type === 'openDetailedPost' && event.data.itemId) {
            this.openItemDetails(event.data.itemId);
        } else if (event.data?.type === 'zoomImage' && event.data.src) {
            const modal = document.getElementById('imageZoomModal');
            const img = document.getElementById('zoomedImage');
            if (modal && img) {
                img.src = event.data.src;
                modal.style.display = 'flex';
            }
        } else if (event.data?.type === 'openFeedbackPopup' && event.data.itemId) {
            if (typeof window.openFeedbackPopup === 'function') {
                window.openFeedbackPopup(event.data.itemId, event.data.sellerId || null);
            }
        }
    }

    // State management
    saveFilterState() {
        localStorage.setItem('filter_school', this.state.filters.school);
        localStorage.setItem('filter_condition', this.state.filters.condition);
        localStorage.setItem('filter_price_min', this.state.filters.priceMin);
        localStorage.setItem('filter_price_max', this.state.filters.priceMax);
        localStorage.setItem('filter_item_types', JSON.stringify(this.state.filters.itemTypes));
        localStorage.setItem('filter_sort', this.state.filters.sort);
        localStorage.setItem('filter_rating', this.state.filters.rating);
    }

    restoreState() {
        // Restore search query
        const savedQuery = localStorage.getItem('currentSearchQuery');
        if (savedQuery) {
            this.state.searchQuery = savedQuery;
            const searchInput = document.querySelector('.search-input');
            if (searchInput) searchInput.value = savedQuery;
        }

        // Restore filters
        this.state.filters.school = localStorage.getItem('filter_school') || '';
        this.state.filters.condition = localStorage.getItem('filter_condition') || '';
        this.state.filters.priceMin = localStorage.getItem('filter_price_min') || '';
        this.state.filters.priceMax = localStorage.getItem('filter_price_max') || '';
        this.state.filters.sort = localStorage.getItem('filter_sort') || 'newest';
        this.state.filters.rating = localStorage.getItem('filter_rating') || '';
        
        const savedItemTypes = localStorage.getItem('filter_item_types');
        if (savedItemTypes) {
            try {
                this.state.filters.itemTypes = JSON.parse(savedItemTypes);
            } catch (e) {
                this.state.filters.itemTypes = [];
            }
        }

        // Apply restored state to UI
        this.applyStateToUI();
    }

    applyStateToUI() {
        // Apply price filters
        const priceMinInput = document.getElementById('price-min');
        const priceMaxInput = document.getElementById('price-max');
        if (priceMinInput) priceMinInput.value = this.state.filters.priceMin;
        if (priceMaxInput) priceMaxInput.value = this.state.filters.priceMax;

        // Apply select filters
        const filterSelects = {
            'school-filter': this.state.filters.school,
            'condition-filter': this.state.filters.condition,
            'sort-filter': this.state.filters.sort,
            'rating-filter': this.state.filters.rating
        };

        Object.entries(filterSelects).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
                // Update styled display
                const styledElement = document.getElementById(id + '-styled');
                if (styledElement) {
                    styledElement.textContent = element.options[element.selectedIndex]?.text || '';
                }
            }
        });

        // Apply checkbox filters
        const checkboxes = document.querySelectorAll('.item-type-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.state.filters.itemTypes.includes(checkbox.value);
        });
    }

    // Real-time updates
    setupRealtimeSubscriptions() {
        this.supabase
            .channel('public:item')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'item' 
            }, () => {
                this.loadItems();
                this.updateNotificationBadge();
            })
            .subscribe();
    }

    startTimeUpdates() {
        setInterval(() => {
            this.updateTimeAgoElements();
        }, this.config.updateInterval);
    }

    updateTimeAgoElements() {
        const elements = document.querySelectorAll('.time-ago');
        elements.forEach(el => {
            const createdAt = el.getAttribute('data-created-at');
            if (createdAt) {
                el.textContent = this.formatTimeAgo(createdAt);
            }
        });
    }

    // Notification management
    async updateNotificationBadge() {
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) return;

            const response = await fetch(`${window.location.origin}/notifications`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (response.ok) {
                const data = await response.json();
                const unreadCount = data.filter(n => !n.is_read && n.type === 'new_item').length;
                
                // Update both desktop and mobile badges
                const badges = ['notificationBadge', 'mobileNotificationBadge'];
                badges.forEach(badgeId => {
                    const badge = document.getElementById(badgeId);
                    if (badge) {
                        if (unreadCount > 0) {
                            badge.textContent = unreadCount;
                            badge.style.display = 'block';
                        } else {
                            badge.style.display = 'none';
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error updating notification badge:', error);
        }
    }

    // UI state management
    showLoadingState() {
        const container = document.getElementById('items-container');
        if (container) {
            container.innerHTML = '<div class="loading-message">Loading items...</div>';
        }
    }

    showNoItemsMessage() {
        const container = document.getElementById('items-container');
        if (container) {
            container.innerHTML = '<div class="no-items-message">No items found matching your search and filters.</div>';
        }
    }

    showError(message) {
        const container = document.getElementById('items-container');
        if (container) {
            container.innerHTML = `<div class="error-message">${this.escapeHtml(message)}</div>`;
        }
    }

    updatePagination() {
        const pageInfo = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (pageInfo) {
            pageInfo.textContent = `Page ${this.state.currentPage} of ${this.state.totalPages}`;
        }

        if (prevBtn) {
            prevBtn.disabled = this.state.currentPage <= 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.state.currentPage >= this.state.totalPages;
        }
    }

    hideLoader() {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    isActionButton(element) {
        return element.closest('.action-btn') !== null;
    }
}

// Global functions for backward compatibility
window.logoutUser = function() {
    // Clear user-related data
    const keysToRemove = [
        'stud_id', 'stud_fname', 'stud_lname', 'stud_email', 
        'userSchool', 'isLoggedIn', 'currentSearchQuery',
        'filter_school', 'filter_condition', 'filter_price_min',
        'filter_price_max', 'filter_item_types', 'access_token'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    sessionStorage.removeItem('stud_id');
    
    window.location.href = 'Login_page.html';
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing CamFlea app...');
    
    // Check if required elements exist
    const requiredElements = [
        'items-container',
        'price-min',
        'price-max', 
        'apply-price-filter'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.error('Missing required elements:', missingElements);
    }
    
    // Check if Supabase is loaded
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded!');
        return;
    }
    
    window.camfleaApp = new CamFlealApp();
});

// Handle page load
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.style.display = 'none';
});