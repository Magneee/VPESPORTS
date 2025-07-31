/**
 * Comments Management System
 * Handles comment submission, likes/dislikes, replies, and WordPress integration
 */

class CommentsManager {
  constructor() {
    this.commentForm = document.getElementById('comment-form');
    this.commentText = document.getElementById('comment-text');
    this.commentsList = document.querySelector('.comments-list');
    this.commentsCount = document.querySelector('.comments-wrapper h3 + span');
    this.sortSelect = document.querySelector('.comments-wrapper select');

    this.init();
  }

  init() {
    if (!this.commentForm) return;

    this.bindEvents();
    this.initWordPressIntegration();
  }

  bindEvents() {
    // Comment form submission
    this.commentForm.addEventListener('submit', (e) => this.handleCommentSubmit(e));

    // Formatting buttons
    const formatButtons = this.commentForm.querySelectorAll('button[type="button"]');
    formatButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleFormatting(e));
    });

    // Comment actions (like, dislike, reply)
    this.commentsList.addEventListener('click', (e) => this.handleCommentActions(e));

    // Sort change
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => this.handleSortChange(e));
    }

    // Auto-resize textarea
    this.commentText.addEventListener('input', () => this.autoResizeTextarea());
  }

  async handleCommentSubmit(e) {
    e.preventDefault();

    // Get content from either textarea or contentEditable div
    let content;
    if (this.commentText.contentEditable === 'true') {
      // Remove placeholder if present
      const placeholder = this.commentText.querySelector('.text-white\\/50');
      if (placeholder) {
        content = '';
      } else {
        content = this.commentText.innerHTML.trim();
        // Convert HTML to plain text for now, or keep HTML for rich text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        content = tempDiv.textContent || tempDiv.innerText || '';
      }
    } else {
      content = this.commentText.value.trim();
    }

    const commentData = {
      content: content,
      post_id: this.getPostId(),
      parent_id: 0, // For replies, this would be the parent comment ID
      author_name: this.getCurrentUserName(),
      author_email: this.getCurrentUserEmail()
    };

    if (!content) {
      this.showNotification('Please enter a comment', 'error');
      return;
    }

    try {
      this.setSubmitButtonLoading(true);

      // WordPress AJAX submission
      const response = await this.submitToWordPress(commentData);

      if (response.success) {
        // Add comment to DOM
        this.addCommentToDOM(response.data.comment);

        // Clear form
        if (this.commentText.contentEditable === 'true') {
          this.commentText.innerHTML = '';
          this.handlePlaceholder(this.commentText);
        } else {
          this.commentText.value = '';
          this.autoResizeTextarea();
        }

        // Update comments count
        this.updateCommentsCount(1);

        this.showNotification('Comment posted successfully!', 'success');
      } else {
        throw new Error(response.data.message || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Comment submission error:', error);
      this.showNotification(error.message || 'Failed to post comment', 'error');
    } finally {
      this.setSubmitButtonLoading(false);
    }
  }

  handleFormatting(e) {
    const button = e.currentTarget;
    const format = button.getAttribute('data-format');

    if (!format) {
      // This is the attach button
      this.handleFileAttachment();
      return;
    }

    // Check if we're working with textarea or contentEditable
    if (this.commentText.tagName === 'TEXTAREA') {
      const start = this.commentText.selectionStart;
      const end = this.commentText.selectionEnd;
      const selectedText = this.commentText.value.substring(start, end);

      if (!selectedText) {
        this.showNotification('Please select text to format', 'info');
        return;
      }

      // Convert textarea to contentEditable for rich formatting
      this.convertToContentEditable();

      // Apply formatting after conversion
      setTimeout(() => {
        this.selectTextAndFormat(selectedText, format);
      }, 100);

    } else if (this.commentText.contentEditable === 'true') {
      // Working with contentEditable
      const selection = window.getSelection();
      const selectedText = selection.toString();

      if (!selectedText) {
        this.showNotification('Please select text to format', 'info');
        return;
      }

      // Apply formatting directly
      document.execCommand(format, false, null);
    }

    this.commentText.focus();
  }

  selectTextAndFormat(textToFind, format) {
    const selection = window.getSelection();
    const range = document.createRange();

    // Find the text node containing our text
    const walker = document.createTreeWalker(
      this.commentText,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let textNode;
    while (textNode = walker.nextNode()) {
      const index = textNode.textContent.indexOf(textToFind);
      if (index !== -1) {
        range.setStart(textNode, index);
        range.setEnd(textNode, index + textToFind.length);
        selection.removeAllRanges();
        selection.addRange(range);

        // Apply formatting
        document.execCommand(format, false, null);
        break;
      }
    }
  }

  convertToContentEditable() {
    // Create contentEditable div to replace textarea for rich text editing
    const editableDiv = document.createElement('div');
    editableDiv.contentEditable = true;
    editableDiv.className = this.commentText.className.replace('resize-none', '');
    editableDiv.style.minHeight = '96px'; // 4 rows equivalent
    editableDiv.style.maxHeight = '200px';
    editableDiv.style.overflowY = 'auto';
    editableDiv.innerHTML = this.commentText.value.replace(/\n/g, '<br>');
    editableDiv.setAttribute('data-placeholder', this.commentText.placeholder);

    // Add placeholder handling
    if (!editableDiv.innerHTML.trim()) {
      this.handlePlaceholder(editableDiv);
    }

    // Replace textarea with contentEditable div
    this.commentText.parentNode.replaceChild(editableDiv, this.commentText);
    this.commentText = editableDiv;

    // Re-bind events
    this.commentText.addEventListener('input', () => {
      this.handlePlaceholder(editableDiv);
    });

    this.commentText.addEventListener('focus', () => {
      const placeholder = editableDiv.querySelector('.text-white\\/50');
      if (placeholder) {
        editableDiv.innerHTML = '';
      }
    });

    this.commentText.addEventListener('blur', () => {
      if (!editableDiv.innerHTML.trim()) {
        this.handlePlaceholder(editableDiv);
      }
    });
  }

  handlePlaceholder(editableDiv) {
    const placeholder = editableDiv.getAttribute('data-placeholder');
    if (!editableDiv.innerHTML.trim() || editableDiv.innerHTML === '<br>') {
      editableDiv.innerHTML = `<span class="text-white/50 pointer-events-none">${placeholder}</span>`;
    }
  }

  async handleCommentActions(e) {
    const button = e.target.closest('button');
    if (!button) return;

    const commentItem = button.closest('.comment-item');
    const commentId = commentItem.getAttribute('data-comment-id');

    if (button.classList.contains('comment-like')) {
      await this.handleLike(commentId, button);
    } else if (button.classList.contains('comment-dislike')) {
      await this.handleDislike(commentId, button);
    } else if (button.classList.contains('comment-reply')) {
      this.handleReply(commentId, commentItem);
    }
  }

  async handleLike(commentId, button) {
    try {
      const response = await this.sendCommentAction('like', commentId);

      if (response.success) {
        const countSpan = button.querySelector('span');
        countSpan.textContent = response.data.likes_count;

        // Toggle active state
        button.classList.toggle('text-brand-red');
        button.classList.toggle('text-white/50');

        // WordPress hook
        this.triggerWordPressEvent('comment_liked', {
          comment_id: commentId,
          likes_count: response.data.likes_count
        });
      }
    } catch (error) {
      console.error('Like error:', error);
      this.showNotification('Failed to like comment', 'error');
    }
  }

  async handleDislike(commentId, button) {
    try {
      const response = await this.sendCommentAction('dislike', commentId);

      if (response.success) {
        const countSpan = button.querySelector('span');
        countSpan.textContent = response.data.dislikes_count;

        // Toggle active state
        button.classList.toggle('text-brand-red');
        button.classList.toggle('text-white/50');

        // WordPress hook
        this.triggerWordPressEvent('comment_disliked', {
          comment_id: commentId,
          dislikes_count: response.data.dislikes_count
        });
      }
    } catch (error) {
      console.error('Dislike error:', error);
      this.showNotification('Failed to dislike comment', 'error');
    }
  }

  handleReply(commentId, commentItem) {
    // Check if reply form already exists
    let replyForm = commentItem.querySelector('.reply-form');

    if (replyForm) {
      replyForm.remove();
      return;
    }

    // Create reply form
    replyForm = this.createReplyForm(commentId);
    commentItem.appendChild(replyForm);
  }

  createReplyForm(parentId) {
    const replyForm = document.createElement('div');
    replyForm.className = 'reply-form mt-4 ml-13 bg-brand-dark-gray rounded-xl p-4';

    replyForm.innerHTML = `
      <form class="reply-form-inner space-y-3">
        <textarea 
          placeholder="Write a reply..." 
          rows="3"
          class="w-full bg-transparent rounded-lg py-3 text-white placeholder-white/50 text-sm resize-none outline-none focus:border-brand-red transition-colors"
          required></textarea>
        
        <!-- Reply Form Actions -->
        <div class="flex items-center justify-between">
          <!-- Formatting Tools -->
          <div class="flex items-center gap-3">
                            <button type="button"
                  class="text-white/50 hover:text-white transition-colors" title="Underline" data-format="underline">
                  <svg width="14" height="17" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3.78769 13.791C4.11808 15.3721 4.70806 16.4931 5.55764 17.1539C6.43081 17.7911 7.66978 18.1096 9.27453 18.1096C10.0533 18.1096 10.7259 18.0153 11.2923 17.8265C11.8587 17.6377 12.3188 17.3899 12.6728 17.0831C13.0504 16.7527 13.3336 16.3869 13.5224 15.9857C13.7112 15.5845 13.8056 15.1597 13.8056 14.7113C13.8056 13.8146 13.5106 13.1538 12.9206 12.729C12.3542 12.2806 11.6345 11.9384 10.7613 11.7024C9.88811 11.4428 8.94414 11.2305 7.92937 11.0653C6.9146 10.8765 5.97063 10.6051 5.09745 10.2511C4.22428 9.89709 3.4927 9.3897 2.90272 8.72892C2.33633 8.06814 2.05314 7.13597 2.05314 5.93241C2.05314 4.39845 2.60772 3.14769 3.71689 2.18012C4.84966 1.18894 6.44261 0.693359 8.49575 0.693359C10.4781 0.693359 12.0828 1.14175 13.31 2.03852C14.5608 2.91169 15.316 4.38665 15.5755 6.46339H13.4162C13.2274 5.04743 12.6846 4.05626 11.7879 3.48988C10.9147 2.89989 9.80551 2.6049 8.46035 2.6049C7.11519 2.6049 6.08862 2.89989 5.38064 3.48988C4.67266 4.05626 4.31867 4.81144 4.31867 5.75541C4.31867 6.58139 4.60187 7.21857 5.16825 7.66695C5.75823 8.09174 6.48981 8.44573 7.36298 8.72892C8.23616 8.98852 9.18013 9.22451 10.1949 9.4369C11.2097 9.6493 12.1536 9.95609 13.0268 10.3573C13.9 10.7349 14.6198 11.2541 15.1862 11.9148C15.7761 12.5756 16.0711 13.496 16.0711 14.676C16.0711 15.5491 15.8823 16.3279 15.5047 17.0123C15.1272 17.6731 14.608 18.2276 13.9472 18.676C13.2864 19.1244 12.4958 19.4548 11.5755 19.6672C10.6787 19.9032 9.68752 20.0212 8.60195 20.0212C7.51638 20.0212 6.54881 19.856 5.69923 19.5256C4.87326 19.2188 4.16528 18.7822 3.5753 18.2158C2.98531 17.6495 2.52513 16.9887 2.19474 16.2335C1.86435 15.4783 1.67555 14.6642 1.62835 13.791H3.78769Z"
                      fill="white" fill-opacity="0.5" />
                    <path d="M0 8.41033H17.6995V10.1803H0V8.41033Z" fill="white" fill-opacity="0.5" />
                  </svg>
                </button>

                <button type="button" class="text-white/50 hover:text-white transition-colors" title="Italic"
                  data-format="italic">
                  <svg width="14" height="17" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9.12919 19.854L8.96622 20.4022H0.699219L0.906635 19.854C1.7363 19.8343 2.28447 19.7651 2.55115 19.6466C2.98573 19.4787 3.30673 19.2466 3.51415 18.9503C3.84009 18.4861 4.1759 17.6564 4.5216 16.4613L8.01803 4.34229C8.31434 3.33484 8.4625 2.57432 8.4625 2.06072C8.4625 1.80392 8.3983 1.58663 8.2699 1.40884C8.1415 1.23106 7.94396 1.09772 7.67728 1.00882C7.42048 0.910055 6.91182 0.86067 6.15129 0.86067L6.32908 0.3125H14.0924L13.9294 0.86067C13.2973 0.850793 12.8281 0.919932 12.5219 1.06809C12.0775 1.26562 11.7367 1.54712 11.4997 1.91256C11.2725 2.27801 10.9762 3.08792 10.6107 4.34229L7.12911 16.4613C6.81305 17.5774 6.65502 18.2885 6.65502 18.5947C6.65502 18.8416 6.71428 19.054 6.8328 19.2318C6.9612 19.3997 7.15874 19.533 7.42542 19.6318C7.70197 19.7207 8.2699 19.7948 9.12919 19.854Z"
                      fill="white" fill-opacity="0.5" />
                  </svg>
                </button>

                <button type="button" class="text-white/50 hover:text-white transition-colors" title="Bold"
                  data-format="bold">
                  <svg width="14" height="17" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3.56946 8.74396H9.24341C10.0778 8.74396 10.7731 8.51218 11.3294 8.04863C11.8857 7.56653 12.1638 6.88046 12.1638 5.99043C12.1638 4.98914 11.9135 4.28454 11.4129 3.87661C10.9122 3.46867 10.1891 3.26471 9.24341 3.26471H3.56946V8.74396ZM0.0927734 0.427734H9.74405C11.5241 0.427734 12.9519 0.835666 14.0273 1.65153C15.1028 2.46739 15.6405 3.70045 15.6405 5.35072C15.6405 6.35201 15.3902 7.21422 14.8895 7.93737C14.4074 8.64198 13.7121 9.18898 12.8035 9.57837V9.634C14.0273 9.89359 14.9544 10.4777 15.5849 11.3862C16.2153 12.2763 16.5305 13.3981 16.5305 14.7517C16.5305 15.5305 16.3915 16.2629 16.1133 16.9489C15.8352 17.6165 15.3995 18.2005 14.8061 18.7012C14.2127 19.1833 13.4525 19.5727 12.5254 19.8694C11.5983 20.1475 10.495 20.2866 9.21559 20.2866H0.0927734V0.427734ZM3.56946 17.4496H9.71624C10.7731 17.4496 11.589 17.1807 12.1638 16.643C12.7572 16.0867 13.0539 15.3079 13.0539 14.3067C13.0539 13.3239 12.7572 12.573 12.1638 12.0538C11.589 11.516 10.7731 11.2472 9.71624 11.2472H3.56946V17.4496Z"
                      fill="white" fill-opacity="0.5" />
                  </svg>
                </button>


                <div class="w-px self-stretch opacity-20 bg-white/50"></div>

                <button type="button" class="text-white/50 hover:text-white transition-colors" title="Attach">
                  <svg width="19" height="19" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_316_2518)">
                      <path
                        d="M20 13.9072L11.9628 22.3791C10.9782 23.4169 9.64274 24 8.25028 24C6.85782 24 5.52239 23.4169 4.53777 22.3791C3.55315 21.3412 3 19.9335 3 18.4658C3 16.998 3.55315 15.5904 4.53777 14.5525L12.575 6.08062C13.2314 5.38871 14.1217 5 15.05 5C15.9783 5 16.8686 5.38871 17.525 6.08062C18.1814 6.77254 18.5502 7.71097 18.5502 8.68948C18.5502 9.66799 18.1814 10.6064 17.525 11.2983L9.47904 19.7702C9.15083 20.1162 8.70569 20.3105 8.24153 20.3105C7.77738 20.3105 7.33224 20.1162 7.00403 19.7702C6.67583 19.4243 6.49144 18.955 6.49144 18.4658C6.49144 17.9765 6.67583 17.5073 7.00403 17.1614L14.429 9.344"
                        stroke="white" stroke-opacity="0.5" stroke-width="2.27565" stroke-linecap="round"
                        stroke-linejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_316_2518">
                        <rect width="25.285" height="25.285" fill="white" transform="translate(0.530273 0.714844)" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button type="button" class="cancel-reply text-white/50 hover:text-white text-sm px-3 py-1 transition-colors">
              Cancel
            </button>
             <button type="submit"
                class="btn-secondary-small px-4 py-2 font-semibold text-base tracking-tightest rounded-[11px]">
                Reply
              </button>
          </div>
        </div>
      </form>
    `;

    // Bind reply form events
    const form = replyForm.querySelector('.reply-form-inner');
    const cancelBtn = replyForm.querySelector('.cancel-reply');
    const textarea = replyForm.querySelector('textarea');
    const formatButtons = replyForm.querySelectorAll('button[data-format], button[title="Attach"]');

    form.addEventListener('submit', (e) => this.handleReplySubmit(e, parentId));
    cancelBtn.addEventListener('click', () => replyForm.remove());

    // Bind formatting buttons for reply form
    formatButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleReplyFormatting(e, textarea);
      });
    });

    // Focus textarea
    setTimeout(() => textarea.focus(), 100);

    return replyForm;
  }

  handleReplyFormatting(e, textarea) {
    // Temporarily set this textarea as the active comment text for formatting
    const originalCommentText = this.commentText;
    this.commentText = textarea;

    // Handle formatting
    this.handleFormatting(e);

    // Restore original comment text
    this.commentText = originalCommentText;
  }

  async handleReplySubmit(e, parentId) {
    e.preventDefault();

    const form = e.currentTarget;
    const textarea = form.querySelector('textarea');
    const content = textarea.value.trim();

    if (!content) return;

    const replyData = {
      content: content,
      post_id: this.getPostId(),
      parent_id: parentId,
      author_name: this.getCurrentUserName(),
      author_email: this.getCurrentUserEmail()
    };

    try {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Posting...';
      submitBtn.disabled = true;

      const response = await this.submitToWordPress(replyData);

      if (response.success) {
        // Add reply to DOM (would need to implement nested structure)
        this.showNotification('Reply posted successfully!', 'success');

        // Remove reply form
        form.closest('.reply-form').remove();

        // Update comments count
        this.updateCommentsCount(1);
      } else {
        throw new Error(response.data.message || 'Failed to post reply');
      }
    } catch (error) {
      console.error('Reply submission error:', error);
      this.showNotification(error.message || 'Failed to post reply', 'error');
    }
  }

  handleSortChange(e) {
    const sortBy = e.target.value;
    this.sortComments(sortBy);
  }

  sortComments(sortBy) {
    const comments = Array.from(this.commentsList.children);

    comments.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return this.getCommentTimestamp(b) - this.getCommentTimestamp(a);
        case 'oldest':
          return this.getCommentTimestamp(a) - this.getCommentTimestamp(b);
        case 'popular':
          return this.getCommentLikes(b) - this.getCommentLikes(a);
        default:
          return 0;
      }
    });

    // Re-append sorted comments
    comments.forEach(comment => this.commentsList.appendChild(comment));
  }

  autoResizeTextarea() {
    this.commentText.style.height = 'auto';
    this.commentText.style.height = Math.min(this.commentText.scrollHeight, 200) + 'px';
  }

  addCommentToDOM(comment) {
    const commentHTML = this.createCommentHTML(comment);
    this.commentsList.insertAdjacentHTML('afterbegin', commentHTML);
  }

  createCommentHTML(comment) {
    return `
      <div class="comment-item" data-comment-id="${comment.id}">
        <div class="flex gap-3">
          <div class="flex-shrink-0">
            <img src="${comment.author_avatar || '../assets/images/avatar-placeholder.png'}" 
                 alt="${comment.author_name}" 
                 class="w-10 h-10 rounded-full object-cover">
          </div>
          
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-white font-semibold text-sm tracking-tight">${comment.author_name}</span>
              <span class="w-1 h-1 bg-white/30 rounded-full"></span>
              <span class="text-white/50 text-sm font-medium">${comment.time_ago}</span>
            </div>
            
            <div class="comment-text mb-3">
              <p class="text-white/80 text-sm leading-relaxed font-normal tracking-tight">
                ${comment.content}
              </p>
            </div>
            
            <div class="flex items-center gap-4">
              <button class="comment-like flex items-center gap-1 text-white/50 hover:text-brand-red transition-colors group">
                <svg class="w-4 h-4 group-hover:fill-brand-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span class="text-sm font-medium">${comment.likes_count || 0}</span>
              </button>
              
              <button class="comment-dislike flex items-center gap-1 text-white/50 hover:text-white transition-colors">
                <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span class="text-sm font-medium">${comment.dislikes_count || 0}</span>
              </button>
              
              <button class="comment-reply text-white/50 hover:text-white transition-colors text-sm font-medium">
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // WordPress Integration Methods
  async submitToWordPress(commentData) {
    if (typeof wp !== 'undefined' && wp.ajax) {
      // WordPress AJAX
      return new Promise((resolve, reject) => {
        wp.ajax.post('submit_comment', commentData)
          .done(resolve)
          .fail(reject);
      });
    } else {
      // Fallback for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              comment: {
                id: Date.now(),
                content: commentData.content,
                author_name: commentData.author_name,
                author_avatar: '../assets/images/avatar-placeholder.png',
                time_ago: 'just now',
                likes_count: 0,
                dislikes_count: 0
              }
            }
          });
        }, 1000);
      });
    }
  }

  async sendCommentAction(action, commentId) {
    if (typeof wp !== 'undefined' && wp.ajax) {
      return new Promise((resolve, reject) => {
        wp.ajax.post('comment_action', {
          action: action,
          comment_id: commentId
        }).done(resolve).fail(reject);
      });
    } else {
      // Fallback for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              likes_count: Math.floor(Math.random() * 1000),
              dislikes_count: Math.floor(Math.random() * 100)
            }
          });
        }, 500);
      });
    }
  }

  initWordPressIntegration() {
    // Register WordPress hooks
    if (typeof wp !== 'undefined' && wp.hooks) {
      wp.hooks.addAction('comment_posted', 'vpesports', this.onCommentPosted.bind(this));
      wp.hooks.addAction('comment_liked', 'vpesports', this.onCommentLiked.bind(this));
      wp.hooks.addAction('comment_replied', 'vpesports', this.onCommentReplied.bind(this));
    }
  }

  triggerWordPressEvent(eventName, data) {
    if (typeof wp !== 'undefined' && wp.hooks) {
      wp.hooks.doAction(eventName, data);
    }

    // Custom event for other scripts
    window.dispatchEvent(new CustomEvent(`vpesports_${eventName}`, { detail: data }));
  }

  // Helper Methods
  getPostId() {
    return document.body.getAttribute('data-post-id') ||
      document.querySelector('meta[name="post-id"]')?.content ||
      '1';
  }

  getCurrentUserName() {
    return document.body.getAttribute('data-user-name') || 'Anonymous';
  }

  getCurrentUserEmail() {
    return document.body.getAttribute('data-user-email') || '';
  }

  getCommentTimestamp(commentElement) {
    const timeText = commentElement.querySelector('.text-white\\/50').textContent;
    // Convert "X min ago" to timestamp (simplified)
    const minutes = parseInt(timeText.match(/\d+/)?.[0] || '0');
    return Date.now() - (minutes * 60 * 1000);
  }

  getCommentLikes(commentElement) {
    const likesSpan = commentElement.querySelector('.comment-like span');
    return parseInt(likesSpan.textContent) || 0;
  }

  updateCommentsCount(increment) {
    if (this.commentsCount) {
      const currentCount = parseInt(this.commentsCount.textContent) || 0;
      this.commentsCount.textContent = currentCount + increment;
    }
  }

  setSubmitButtonLoading(loading) {
    const submitBtn = this.commentForm.querySelector('button[type="submit"]');
    if (loading) {
      submitBtn.textContent = 'Posting...';
      submitBtn.disabled = true;
    } else {
      submitBtn.textContent = 'Submit';
      submitBtn.disabled = false;
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${type === 'success' ? 'bg-green-600' :
        type === 'error' ? 'bg-red-600' :
          'bg-blue-600'
      }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  handleFileAttachment() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.multiple = false;

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        // Handle file upload (would need backend implementation)
        console.log('File selected:', file.name);
        this.showNotification('File attachment feature coming soon!', 'info');
      }
    });

    input.click();
  }

  // WordPress hook callbacks
  onCommentPosted(data) {
    console.log('Comment posted:', data);
  }

  onCommentLiked(data) {
    console.log('Comment liked:', data);
  }

  onCommentReplied(data) {
    console.log('Comment replied:', data);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const commentsManager = new CommentsManager();

  // Export for WordPress integration
  window.VPEsportsComments = commentsManager;
});

// Export for WordPress integration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CommentsManager;
} 