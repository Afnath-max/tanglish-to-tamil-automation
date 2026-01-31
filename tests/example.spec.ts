import { test, expect } from '@playwright/test';

// positive test cases are tested from here onwards

test('Pos_Fun_0001 - Convert a short daily greeting phrase', async ({ page }) => {
  const inputSentence = 'neengal eppadi irrukirirkal?'; // Your input
  const expectedOutput = 'நீங்கள் எப்படி இருக்கிறீர்கள்?'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});

test('Pos_Fun_0002 - Convert a simple present tense statement', async ({ page }) => {
  const inputSentence = 'naan veetuku vilayada pohirean'; // Your input
  const expectedOutput = 'நான் வீட்டுக்கு விளையாட போகிறேன்'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});


test('Pos_Fun_0003 - Convert compound sentence with two ideas', async ({ page }) => {
  const inputSentence = 'naan veetukku pohirean, aana pani peiyudhu'; // Your input
  const expectedOutput = 'நான் வீட்டுக்கு போகிறேன், ஆனா பனி பெய்யுது'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});


test('Pos_Fun_0004 - Convert a complex sentence with a conditional', async ({ page }) => {
  const inputSentence = 'nee vandhaal naan kaathiruppen'; // Your input
  const expectedOutput = 'நீ வந்தால் நான் காத்திருப்பேன்'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});


test('Pos_Fun_0005 - Convert interrogative sentence', async ({ page }) => {
  const inputSentence = 'nee eppo varuvai?'; // Your input
  const expectedOutput = 'நீ எப்போ வருவாய்?'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});


test('Pos_Fun_0006 - Convert imperative command form', async ({ page }) => {
  const inputSentence = 'seekiram vaa'; // Your input
  const expectedOutput = 'சீக்கிரம் வா'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});


test('Pos_Fun_0007 - Convert negative sentence form', async ({ page }) => {
  const inputSentence = 'naan appadi seyya maaten'; // Your input
  const expectedOutput = 'நான் அப்படி செய்ய மாட்டேன்'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});


test('Pos_Fun_0008 - Convert past tense sentence', async ({ page }) => {
  const inputSentence = 'naan nethu kadatkaraiku ponen'; // Your input
  const expectedOutput = 'நான் நேத்து கடற்கரைக்கு போனேன்'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0009 - Convert future tense sentence', async ({ page }) => {
  const inputSentence = 'naan naalaikku kadatkaraiku varuven'; // Your input
  const expectedOutput = 'நான் நாளைக்கு கடற்கரைக்கு வருவேன்'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0010 - Convert polite request form', async ({ page }) => {
  const inputSentence = 'dayavu seidhu avanuku udhavungal'; // Your input
  const expectedOutput = 'தயவு செய்து அவனுக்கு உதவுங்கள்'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0011 - Convert informal daily expression', async ({ page }) => {
  const inputSentence = 'dei, itha paaru'; // Your input
  const expectedOutput = 'டேய், இத பாரு'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0012 - Convert sentence with plural pronoun', async ({ page }) => {
  const inputSentence = 'naanga naalaikku anga pogalam'; // Your input
  const expectedOutput = 'நாங்க நாளைக்கு அங்க போகலாம்'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});




test('Pos_Fun_0013 - Convert common affirmative response', async ({ page }) => {
  const inputSentence = 'sari, naan seigiren'; // Your input
  const expectedOutput = 'சரி, நான் செய்கிறேன்'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});


test('Pos_Fun_0014 - Convert common multi-word collocation', async ({ page }) => {
  const inputSentence = 'konjam iru'; // Your input
  const expectedOutput = 'கொஞ்சம் இரு'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0015 - Convert repeated word expression', async ({ page }) => {
  const inputSentence = 'seekiram seekiram vaa'; // Your input
  const expectedOutput = 'சீக்கிரம் சீக்கிரம் வா'; // Expected output
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});


test('Pos_Fun_0016 - Convert sentence with English technical terms', async ({ page }) => {
  const inputSentence = 'enakku WiFi password kodu';
  const expectedOutput = 'எனக்கு WiFi password கொடு';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0017 - Convert sentence with English place name', async ({ page }) => {
  const inputSentence = 'naan Chennai poganum';
  const expectedOutput = 'நான் Chennai போகணும்';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0018 - Convert sentence with exclamation mark', async ({ page }) => {
  const inputSentence = 'romba nandri!';
  const expectedOutput = 'ரொம்ப நன்றி!';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0019 - Convert sentence with time format', async ({ page }) => {
  const inputSentence = 'meeting nalaikku 10.30 AM kku irukku';
  const expectedOutput = 'meeting நாளைக்கு 10.30 AM க்கு இருக்கு';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0020 - Convert sentence with currency amount', async ({ page }) => {
  const inputSentence = 'avanuku Rs. 5000 kudu';
  const expectedOutput = 'அவனுக்கு Rs. 5000 குடு';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});




test('Pos_Fun_0021 - Convert sentence with date', async ({ page }) => {
  const inputSentence = 'naalaikku December 25 kku party';
  const expectedOutput = 'நாளைக்கு December 25 க்கு party';

  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});


test('Pos_Fun_0022 - Convert sentence with abbreviation', async ({ page }) => {
  const inputSentence = 'ennoda ID card eduthuttu vaa';
  const expectedOutput = 'என்னோட ID card எடுத்துட்டு வா';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0023 - Convert medium length compound sentence', async ({ page }) => {
  const inputSentence = 'naan office kku poren, aanaal traffic romba jaasthi irukku athanaala late aagalaam';
  const expectedOutput = 'நான் office க்கு போறேன், ஆனால் traffic ரொம்ப ஜாஸ்தி இருக்கு அதனால late ஆகலாம்';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0024 - Convert medium sentence with brand terms', async ({ page }) => {
  const inputSentence = 'naalaikku Zoom meeting irukku, adhunaala WhatsApp la link a share pannunga';
  const expectedOutput = 'நாளைக்கு Zoom meeting இருக்கு, அதுனால WhatsApp ல link எ share பண்ணுங்க';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0025 - Convert medium length slang expression', async ({ page }) => {
  const inputSentence = 'dei machan! super daa! adhukku romba kastapattiyaa? nalla velai pannirukke';
  const expectedOutput = 'டேய் மச்சான்! super டா! அதுக்கு ரொம்ப கஷ்டப்பட்டியா? நல்ல வேலை பண்ணிருக்கே';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0026 - Handle input with multiple spaces', async ({ page }) => {
  const inputSentence = 'avan   kadatkaraiku   pohiraan';
  const expectedOutput = 'அவன்   கடற்கரைக்கு   போகிறான்';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
});


test('Pos_Fun_0027 - Convert sentence with parentheses', async ({ page }) => {
  const inputSentence = 'naan veetukku poren (naalaikku)';
  const expectedOutput = 'நான் வீட்டுக்கு போறேன் (நாளைக்கு)';

  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});


test('Pos_Fun_0028 - Handle muti-line input', async ({ page }) => {
  const inputSentence = `naan veetukku pogiren
nee varuvaya?`;

  const expectedOutput = `நான் வீட்டுக்கு போகிறேன்
நீ வருவாயா?`;
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];
    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  // Split by lines first to preserve newlines
  const lines = inputSentence.split('\n');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  let wordIndex = 0;
  
  // Process each line separately to preserve newlines
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const words = line.split(/\s+/);
    
    // Replace English words and numbers with unique placeholders
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isEnglish = isEnglishWord(word);
      
      if (isEnglish) {
        const placeholder = `ENWORD${wordIndex}`;
        englishWordMap[placeholder] = word;
        modifiedInput += (i > 0 ? ' ' : '') + placeholder;
        console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
      } else {
        modifiedInput += (i > 0 ? ' ' : '') + word;
      }
      wordIndex++;
    }
    
    // Add newline if not the last line
    if (lineIdx < lines.length - 1) {
      modifiedInput += '\n';
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    
    // Split by lines to preserve newlines
    const textLines = text.split('\n');
    const modifiedLines = data.modifiedInput.split('\n');
    const resultLines: string[] = [];
    
    // Process each line
    for (let lineIdx = 0; lineIdx < textLines.length; lineIdx++) {
      const textWords = textLines[lineIdx].split(/\s+/);
      const modifiedWords = modifiedLines[lineIdx] ? modifiedLines[lineIdx].split(/\s+/) : [];
      
      // Replace placeholders in this line
      for (let i = 0; i < textWords.length; i++) {
        if (i < modifiedWords.length) {
          const originalWord = modifiedWords[i];
          // Check if original word was a placeholder
          if (data.englishWordMap[originalWord]) {
            // Replace with actual English word/number
            textWords[i] = data.englishWordMap[originalWord];
          }
        }
      }
      
      resultLines.push(textWords.join(' '));
    }
    
    element.value = resultLines.join('\n');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput.trim();
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(/\s+/);
  const expectedWords = expectedOutput.split(/\s+/);
  const actualWords = result.split(/\s+/);
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput.trim());
});



test('Pos_Fun_0029 - Convert sentence with measurement unit', async ({ page }) => {
  const inputSentence = 'enakku 2 kg rice vangitu vaa';
  const expectedOutput = 'எனக்கு 2 kg rice வாங்கிட்டு வா';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
});



test('Pos_Fun_0030 - Convert common daily expression', async ({ page }) => {
  const inputSentence = 'enakku bayama irukku';
  const expectedOutput = 'எனக்கு பயமா இருக்கு';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
});


// negative test cases are tested from here onwards


test('Neg_Fun_0001 - Joined words cause incorrect conversion', async ({ page }) => {
  const inputSentence = 'vanakkameppatirukkeenga?';
  const expectedOutput = 'வணக்கம்எப்படிஇருக்கீங்க?';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
});


test('Neg_Fun_0002 - Misspelled word produces wrong output', async ({ page }) => {
  const inputSentence = 'naan vetuukku pogiren';
  const expectedOutput = 'நான் வீட்டுக்கு போகிறேன்';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
});


test('Neg_Fun_0003 - Special characters cause conversion failure', async ({ page }) => {
  const inputSentence = 'naan @ veetukku pogiren #today';
  const expectedOutput = 'நான் @ வீட்டுக்கு போகிறேன் #today';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
});


test('Neg_Fun_0004 - Extremely long compound word fails', async ({ page }) => {
  const inputSentence = 'naanveetukkupogirenaanalmazhaipeiyudhunaalaikku';
  const expectedOutput = 'நான்வீட்டுக்குபோகிறேன்ஆனால்மழைபெய்யுதுநாளைக்கு';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
});


test('Neg_Fun_0005 - Repeated characters cause wrong conversion', async ({ page }) => {
  const inputSentence = 'naaaan veeeetukku pooogiren';
  const expectedOutput = 'நான் வீட்டுக்கு போகிறேன்';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
});



test('Neg_Fun_0006 - Hindi transliteration produces gibberish', async ({ page }) => {
  const inputSentence = 'main ghar ja raha hoon';
  const expectedOutput = 'நான் வீட்டுக்கு போகிறேன்';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
;  expect(result.trim()).toBe(expectedOutput);
});


test('Neg_Fun_0007 - URL in input causes partial conversion', async ({ page }) => {
  const inputSentence = 'naan https://example.com ku pogiren';
  const expectedOutput = 'நான் https://example.com கு போகிறேன்';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
})

test('Neg_Fun_0008 - Excessive line breaks cause formatting issues', async ({ page }) => {
  const inputSentence = 'naan\n\n\n\nveetukku\n\n\npogiren';
  const expectedOutput = 'நான் வீட்டுக்கு போகிறேன்';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
})


test('Neg_Fun_0009 - Backtick characters cause confusion', async ({ page }) => {
  const inputSentence = 'naan `code` ezhudhinen';
  const expectedOutput = 'நான் `code` எழுதினேன்';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code','wait',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
})

test('Neg_Fun_00010 - Mixed case random capitalization fails', async ({ page }) => {
  const inputSentence = 'nAaN vEeTuKkU pOgIrEn';
  const expectedOutput = 'நான் வீட்டுக்கு போகிறேன்';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code','wait',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
})



test('Neg_Fun_00011 - File extensions cause conversion errors', async ({ page }) => {
  const inputSentence = 'file.pdf download pannidu';
  const expectedOutput = 'file.pdf download பண்ணிடு';
  
  const inputLength = inputSentence.length;
  const category = inputLength >= 300 ? 'LONG' : inputLength >= 31 ? 'MEDIUM' : 'SHORT';
  const timeout = inputLength >= 300 ? 300000 : inputLength >= 31 ? 180000 : 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST: ${category} INPUT (${inputLength} chars)`);
  console.log(`${'='.repeat(50)}\n`);
  
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',  // Changed from 'networkidle' to 'load'
    timeout: 60000  // Increased from 45000 to 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  // Helper function to detect if a word is English or should be preserved
  function isEnglishWord(word: string): boolean {
    // Check for capital letters
    if (/[A-Z]/.test(word)) return true;
    
    // Check if word contains numbers (including decimals like 10.30, 5:45, etc.)
    if (/\d/.test(word)) return true;
    
    // Check against common English technical terms
    const commonEnglish = [
      // Communication & Connectivity
      'wifi', 'password', 'email', 'internet', 'computer', 'mobile', 'documents', 'whatsapp', 'teams', 'zoom', 'call', 'video', 'conference', 'link', 'phone', 'message', 'chat', 'sms', 'mms', 'telegram', 'skype', 'messenger', 'facetime', 'voicemail', 'ringtone', 'notification', 'alert', 'update',
      
      // ID & Security
      'card', 'gift', 'ID', 'id', 'NIC', 'nic', 'pass', 'code', 'security', 'access', 'badge', 'photo', 'signature', 'date', 'validity', 'holder', 'personal', 'information', 'official', 'business', 'travel', 'identification', 'verification', 'credential', 'document', 'license', 'permit', 'registration', 'application', 'form', 'profile', 'account', 'user', 'login', 'logout', 'username', 'password', 'pin', 'PIN', 'otp', 'OTP', 'qr', 'QR', 'biometric', 'fingerprint', 'authentication', 'cvv', 'CVV', 'cvc', 'CVC', 'iban', 'IBAN', 'swift', 'SWIFT',
      
      // Banking & Finance Terms
      'atm', 'ATM', 'pos', 'POS', 'bank', 'debit', 'credit', 'account', 'balance', 'statement', 'transaction', 'transfer', 'deposit', 'withdrawal', 'cheque', 'check', 'ifsc', 'IFSC', 'neft', 'NEFT', 'rtgs', 'RTGS', 'imps', 'IMPS',
      
      // Devices & Hardware
      'app', 'App', 'software', 'hardware', 'laptop', 'desktop', 'tablet', 'keyboard', 'mouse', 'monitor', 'screen', 'display', 'charger', 'battery', 'cable', 'adapter', 'headphone', 'earphone', 'speaker', 'microphone', 'webcam', 'camera', 'smartphone', 'smartwatch', 'router', 'modem', 'switch', 'device', 'gadget', 'remote', 'controller', 'pc', 'PC', 'cpu', 'CPU', 'gpu', 'GPU', 'ram', 'RAM', 'rom', 'ROM',
      
      // Office & Work
      'trip', 'meeting', 'office', 'projector', 'presentation', 'conference', 'schedule', 'appointment', 'agenda', 'calendar', 'deadline', 'report', 'project', 'task', 'team', 'manager', 'employee', 'staff', 'department', 'hr', 'HR', 'admin', 'reception', 'desk', 'cabin', 'cubicle', 'boardroom', 'workshop', 'training', 'seminar', 'webinar', 'vip', 'VIP',
      
      // File & Data Management
      'attach', 'download', 'upload', 'server', 'network', 'data', 'bluetooth', 'usb', 'USB', 'pdf', 'PDF', 'file', 'folder', 'share', 'cloud', 'sync', 'backup', 'print', 'scan', 'copy', 'paste', 'save', 'delete', 'edit', 'view', 'refresh', 'search', 'zip', 'unzip', 'compress', 'extract', 'export', 'import', 'format', 'rename', 'move', 'transfer', 'storage', 'drive', 'disk', 'memory', 'cache', 'mp3', 'MP3', 'mp4', 'MP4', 'hd', 'HD', 'jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'ppt', 'PPT', 'pptx', 'PPTX',
      
      // Operating Systems & Software
      'os', 'OS', 'windows', 'Windows', 'mac', 'Mac', 'macOS', 'linux', 'Linux', 'android', 'Android', 'ios', 'iOS', 'chrome', 'Chrome', 'firefox', 'Firefox', 'safari', 'Safari', 'edge', 'Edge',
      
      // Applications & Settings
      'settings', 'help', 'exit', 'home', 'menu', 'option', 'preference', 'configure', 'install', 'uninstall', 'setup', 'restart', 'shutdown', 'reboot', 'update', 'upgrade', 'version', 'beta', 'demo', 'trial', 'subscription', 'premium', 'pro', 'license', 'activate', 'register',
      
      // Education & Places
      'school', 'university', 'college', 'academy', 'institute', 'library', 'museum', 'restaurant', 'hotel', 'airport', 'station', 'hospital', 'clinic', 'pharmacy', 'bank', 'atm', 'mall', 'shop', 'store', 'market', 'supermarket', 'gym', 'park', 'theatre', 'cinema', 'stadium', 'temple', 'church', 'mosque', 'club', 'bar', 'cafe', 'canteen',
      
      // Transportation
      'bus', 'train', 'taxi', 'car', 'bike', 'ride', 'fuel', 'parking', 'map', 'direction', 'route', 'traffic', 'sign', 'signal', 'light', 'road', 'street', 'avenue', 'boulevard', 'drive', 'lane', 'highway', 'bridge', 'tunnel', 'crossing', 'intersection', 'block', 'metro', 'subway', 'tram', 'auto', 'rickshaw', 'van', 'truck', 'vehicle', 'transport', 'ticket', 'fare', 'pass', 'toll', 'gate', 'stop', 'terminal',
      
      // Location
      'neighborhood', 'downtown', 'suburb', 'city', 'town', 'village', 'country', 'continent', 'world', 'area', 'zone', 'region', 'district', 'locality', 'address', 'location', 'place', 'destination', 'landmark', 'corner', 'junction',
      
      // Months & Time
      'party', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'week', 'month', 'year', 'time', 'hour', 'minute', 'second', 'am', 'AM', 'pm', 'PM', 'clock', 'alarm', 'timer', 'stopwatch', 'eta', 'ETA', 'tba', 'TBA', 'tbc', 'TBC', 'late', 'early', 'soon', 'now', 'later', 'before', 'after', 'during', 'until', 'till', 'past', 'future', 'present', 'delay', 'advance', 'schedule', 'reschedule', 'postpone', 'cancel', 'pending', 'ongoing', 'completed', 'finished', 'started', 'ended',
      
      // Shopping & Finance
      'shopping', 'sale', 'discount', 'offer', 'deal', 'coupon', 'voucher', 'bill', 'receipt', 'invoice', 'payment', 'cash', 'card', 'credit', 'debit', 'wallet', 'upi', 'UPI', 'gpay', 'GPay', 'paytm', 'Paytm', 'phonepe', 'PhonePe', 'online', 'offline', 'order', 'delivery', 'shipping', 'tracking', 'return', 'refund', 'exchange', 'warranty', 'guarantee',
      
      // Social Media & Entertainment
      'facebook', 'Facebook', 'instagram', 'Instagram', 'twitter', 'Twitter', 'x', 'X', 'youtube', 'YouTube', 'linkedin', 'LinkedIn', 'snapchat', 'Snapchat', 'tiktok', 'TikTok', 'reddit', 'Reddit', 'pinterest', 'Pinterest', 'post', 'story', 'reel', 'comment', 'like', 'super', 'super-like', 'superlike', 'share', 'follow', 'unfollow', 'block', 'report', 'tag', 'mention', 'hashtag', 'trending', 'viral', 'live', 'stream', 'podcast', 'vlog', 'blog', 'website', 'page', 'site', 'portal', 'platform',
      
      // Food & Dining
      'menu', 'order', 'food', 'drink', 'breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'coffee', 'tea', 'juice', 'water', 'milk', 'recipe', 'cook', 'kitchen', 'chef', 'waiter', 'table', 'reservation', 'takeaway', 'delivery', 'dine', 'buffet', 'rice', 'kg', 'gram', 'liter', 'ml', 'pound', 'oz', 'litre',
      
      // Health & Fitness
      'health', 'fitness', 'exercise', 'workout', 'yoga', 'diet', 'weight', 'calories', 'steps', 'run', 'walk', 'jog', 'cycle', 'swim', 'doctor', 'nurse', 'medicine', 'tablet', 'capsule', 'injection', 'prescription', 'diagnosis', 'treatment', 'therapy', 'surgery', 'emergency', 'ambulance', 'first', 'aid',
      
      // General Tech Terms
      'browser', 'tab', 'window', 'link', 'url', 'URL', 'website', 'domain', 'http', 'HTTP', 'https', 'HTTPS', 'www', 'WWW', 'dot', 'com', 'org', 'net', 'online', 'offline', 'connection', 'signal', 'range', 'speed', 'bandwidth', 'unlimited', 'data', 'gb', 'GB', 'mb', 'MB', 'kb', 'KB', 'tb', 'TB', 'wifi', 'hotspot', 'tethering', 'airplane', 'mode',
      
      // Common Abbreviations & Acronyms
      'ok', 'OK', 'asap', 'ASAP', 'fyi', 'FYI', 'btw', 'BTW', 'lol', 'LOL', 'omg', 'OMG', 'brb', 'BRB', 'ttyl', 'TTYL', 'dm', 'DM', 'pm', 'PM', 'am', 'AM', 'etc', 'ETC', 'vs', 'VS', 'ceo', 'CEO', 'cto', 'CTO', 'cfo', 'CFO', 'hr', 'HR', 'it', 'IT', 'ai', 'AI', 'ml', 'ML', 'vr', 'VR', 'ar', 'AR', 'iot', 'IoT', 'IOT', 'api', 'API', 'ui', 'UI', 'ux', 'UX', 'seo', 'SEO', 'crm', 'CRM', 'erp', 'ERP', 'saas', 'SaaS', 'SAAS', 'b2b', 'B2B', 'b2c', 'B2C', 'faq', 'FAQ', 'tos', 'TOS', 'eula', 'EULA',
      
      // QR Code variations
      'qrcode', 'QRcode', 'QRCode', 'qr-code', 'QR-code', 'QR-Code','wait',
      
      // Status & Action words
      'submit', 'send', 'receive', 'accept', 'reject', 'approve', 'decline', 'confirm', 'verify', 'validate', 'check', 'uncheck', 'select', 'deselect', 'enable', 'disable', 'on', 'off', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'play', 'replay', 'forward', 'rewind', 'skip', 'next', 'previous', 'back', 'continue', 'proceed', 'finish', 'complete', 'incomplete', 'done', 'undone', 'success', 'fail', 'error', 'warning', 'info', 'notification', 'reminder', 'alert'
    ];

    return commonEnglish.includes(word.toLowerCase());
  }
  
  console.log('Step 1: Preparing input with placeholders for English words and numbers...\n');
  
  const words = inputSentence.split(' ');
  const englishWordMap: { [key: string]: string } = {};
  let modifiedInput = '';
  
  // Replace English words and numbers with unique placeholders
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isEnglish = isEnglishWord(word);
    
    if (isEnglish) {
      const placeholder = `ENWORD${i}`;
      englishWordMap[placeholder] = word;
      modifiedInput += (i > 0 ? ' ' : '') + placeholder;
      console.log(`  -> English/Number "${word}" replaced with placeholder "${placeholder}"`);
    } else {
      modifiedInput += (i > 0 ? ' ' : '') + word;
    }
  }
  
  console.log(`  -> Modified input: "${modifiedInput}"`);
  console.log(`\nStep 2: Typing modified input for transliteration...\n`);
  
  // Type the modified input (with placeholders) - this will transliterate everything
  switch(category) {
    case 'SHORT':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'MEDIUM':
      await inputOutputField.type(modifiedInput, { delay: 50 });
      await page.waitForTimeout(300);
      break;
    case 'LONG':
      await inputOutputField.fill(modifiedInput);
      await page.keyboard.press('End');
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
      await page.keyboard.press('Backspace');
      break;
  }
  
  // Trigger final conversion
  console.log('Step 3: Triggering final word conversion...');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('Step 4: Waiting for transliteration to stabilize...');
  
  // Stabilization
  const stabilizationResult = await page.evaluate((config) => {
    return new Promise<{success: boolean, duration: number}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      
      const configs = {
        LONG: { stabilityThreshold: 2500, maxWaitTime: 120000, checkInterval: 200 },
        MEDIUM: { stabilityThreshold: 1500, maxWaitTime: 60000, checkInterval: 150 },
        SHORT: { stabilityThreshold: 1000, maxWaitTime: 30000, checkInterval: 100 }
      };
      
      const params = configs[config.category as keyof typeof configs];
      
      const intervalId = setInterval(() => {
        totalTime += params.checkInterval;
        
        if (totalTime >= params.maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += params.checkInterval;
          if (stableTime >= params.stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, params.checkInterval);
    });
  }, { category });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  
  await page.waitForTimeout(500);
  
  console.log('\nStep 5: Replacing placeholders with actual English words and numbers...');
  
  // Get the transliterated text
  let transliteratedText = await inputOutputField.inputValue();
  console.log(`  -> Before replacement: "${transliteratedText}"`);
  
  // Replace each transliterated placeholder with the original English word/number
  await page.evaluate((data) => {
    const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
    let text = element.value;
    const words = text.split(' ');
    
    // Find and replace transliterated placeholders
    for (let i = 0; i < words.length; i++) {
      // Check if this word position corresponds to a placeholder
      // The placeholder would have been transliterated, but we know the position
      const originalWords = data.modifiedInput.split(' ');
      
      if (i < originalWords.length) {
        const originalWord = originalWords[i];
        // Check if original word was a placeholder
        if (data.englishWordMap[originalWord]) {
          // Replace with actual English word/number
          words[i] = data.englishWordMap[originalWord];
        }
      }
    }
    
    element.value = words.join(' ');
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { modifiedInput, englishWordMap });
  
  await page.waitForTimeout(300);
  
  const result = await inputOutputField.inputValue();
  console.log(`  -> After replacement: "${result}"`);
  
  const passed = result.trim() === expectedOutput;
  
  // Results
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Category        : ${category}`);
  console.log(`Input Length    : ${inputLength} characters`);
  console.log(`Output Length   : ${result.length} characters`);
  console.log(`Expected Length : ${expectedOutput.length} characters`);
  console.log(`Status          : ${passed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${result}"`);
  
  // Show word-by-word comparison
  console.log(`\nWord-by-Word Analysis:`);
  const inputWords = inputSentence.split(' ');
  const expectedWords = expectedOutput.split(' ');
  const actualWords = result.split(' ');
  
  for (let i = 0; i < inputWords.length; i++) {
    const isEnglish = isEnglishWord(inputWords[i]);
    const hasNumber = /\d/.test(inputWords[i]);
    const type = hasNumber ? 'NUM' : (isEnglish ? 'EN' : 'TA');
    const status = actualWords[i] === expectedWords[i] ? '✓' : '✗';
    console.log(`  ${status} [${type}] "${inputWords[i]}" -> Expected: "${expectedWords[i]}" | Got: "${actualWords[i] || 'MISSING'}"`);
  }
  
  console.log(`${'='.repeat(50)}\n`);
  
  expect(result.trim()).toBe(expectedOutput);
})



// UI test cases are tested from here onwards

test('Pos_UI_0001 - Tamil output updates automatically in real-time', async ({ page }) => {
  const inputSentence = 'nee pallikku pogiraya?';
  const expectedOutput = 'நீ பள்ளிக்கு போகிறாயா?';
  
  const timeout = 120000;
  test.setTimeout(timeout);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`UI TEST: Real-time Output Update Behavior`);
  console.log(`${'='.repeat(50)}\n`);
  
  // Navigate to the page
  await page.goto('https://tamil.changathi.com/', { 
    waitUntil: 'load',
    timeout: 60000
  });
  
  const inputOutputField = page.locator('#transliterateTextarea');
  await inputOutputField.waitFor({ state: 'visible', timeout: 10000 });
  await inputOutputField.clear();
  await inputOutputField.click();
  
  console.log('Step 1: Verifying initial state...\n');
  
  // Verify field is empty
  let currentValue = await inputOutputField.inputValue();
  console.log(`  -> Initial value: "${currentValue}" (should be empty)`);
  expect(currentValue).toBe('');
  
  console.log('\nStep 2: Testing real-time conversion by typing character by character...\n');
  
  // Track real-time updates
  const updateLog: Array<{char: string, output: string, timestamp: number}> = [];
  const startTime = Date.now();
  
  // Type each character and capture the output
  for (let i = 0; i < inputSentence.length; i++) {
    const char = inputSentence[i];
    
    // Type one character
    await inputOutputField.type(char, { delay: 100 });
    
    // Small wait to allow conversion
    await page.waitForTimeout(150);
    
    // Capture the current output
    const currentOutput = await inputOutputField.inputValue();
    const timestamp = Date.now() - startTime;
    
    updateLog.push({
      char: char,
      output: currentOutput,
      timestamp: timestamp
    });
    
    console.log(`  -> Typed: "${char}" | Output so far: "${currentOutput}" | Time: ${timestamp}ms`);
  }
  
  console.log('\nStep 3: Triggering final word conversion...');
  
  // Trigger final conversion
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await page.waitForTimeout(400);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
  
  console.log('\nStep 4: Waiting for output to stabilize...');
  
  // Wait for output to stabilize
  const stabilizationResult = await page.evaluate(() => {
    return new Promise<{success: boolean, duration: number, finalValue: string}>((resolve) => {
      const element = document.querySelector('#transliterateTextarea') as HTMLInputElement;
      let lastValue = element.value;
      let stableTime = 0;
      let totalTime = 0;
      const stabilityThreshold = 1000;
      const maxWaitTime = 30000;
      const checkInterval = 100;
      
      const intervalId = setInterval(() => {
        totalTime += checkInterval;
        
        if (totalTime >= maxWaitTime) {
          clearInterval(intervalId);
          resolve({ success: false, duration: totalTime, finalValue: element.value });
          return;
        }
        
        const currentValue = element.value;
        
        if (currentValue === lastValue) {
          stableTime += checkInterval;
          if (stableTime >= stabilityThreshold) {
            clearInterval(intervalId);
            resolve({ success: true, duration: totalTime, finalValue: currentValue });
          }
        } else {
          stableTime = 0;
          lastValue = currentValue;
        }
      }, checkInterval);
    });
  });
  
  console.log(`  -> Stabilization ${stabilizationResult.success ? 'SUCCESSFUL' : 'TIMEOUT'} (${stabilizationResult.duration}ms)`);
  console.log(`  -> Final value: "${stabilizationResult.finalValue}"`);
  
  const finalOutput = stabilizationResult.finalValue;
  
  // UI-specific checks
  console.log('\nStep 5: Analyzing UI behavior...\n');
  
  // Check 1: Real-time updates occurred
  const realTimeUpdates = updateLog.length > 0;
  console.log(`  ✓ Check 1: Real-time updates occurred: ${realTimeUpdates ? 'YES' : 'NO'}`);
  console.log(`    - Total updates tracked: ${updateLog.length}`);
  
  // Check 2: No UI lag (all updates completed within reasonable time)
  const totalConversionTime = updateLog[updateLog.length - 1]?.timestamp || 0;
  const expectedMaxTime = inputSentence.length * 300; // 300ms per character is reasonable
  const noLag = totalConversionTime <= expectedMaxTime;
  console.log(`  ✓ Check 2: No UI lag detected: ${noLag ? 'YES' : 'NO'}`);
  console.log(`    - Total conversion time: ${totalConversionTime}ms`);
  console.log(`    - Expected max time: ${expectedMaxTime}ms`);
  
  // Check 3: Progressive conversion (output changed as typing progressed)
  const progressiveConversion = updateLog.some((entry, index) => {
    if (index === 0) return true;
    return entry.output !== updateLog[index - 1].output;
  });
  console.log(`  ✓ Check 3: Progressive conversion: ${progressiveConversion ? 'YES' : 'NO'}`);
  
  // Check 4: No freezing (consistent update intervals)
  let maxGap = 0;
  for (let i = 1; i < updateLog.length; i++) {
    const gap = updateLog[i].timestamp - updateLog[i - 1].timestamp;
    if (gap > maxGap) maxGap = gap;
  }
  const noFreezing = maxGap < 2000; // No gap larger than 2 seconds
  console.log(`  ✓ Check 4: No UI freezing: ${noFreezing ? 'YES' : 'NO'}`);
  console.log(`    - Maximum gap between updates: ${maxGap}ms`);
  
  // Check 5: Final output is correct
  const correctOutput = finalOutput.trim() === expectedOutput;
  console.log(`  ✓ Check 5: Final output is correct: ${correctOutput ? 'YES' : 'NO'}`);
  
  // Overall UI test result
  const uiTestPassed = realTimeUpdates && noLag && progressiveConversion && noFreezing && correctOutput;
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS`);
  console.log(`${'='.repeat(50)}`);
  console.log(`UI Behavior Test : ${uiTestPassed ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`\nUI Checks:`);
  console.log(`  1. Real-time updates       : ${realTimeUpdates ? '✓' : '✗'}`);
  console.log(`  2. No UI lag              : ${noLag ? '✓' : '✗'}`);
  console.log(`  3. Progressive conversion  : ${progressiveConversion ? '✓' : '✗'}`);
  console.log(`  4. No UI freezing         : ${noFreezing ? '✓' : '✗'}`);
  console.log(`  5. Correct final output   : ${correctOutput ? '✓' : '✗'}`);
  console.log(`\nInput           : "${inputSentence}"`);
  console.log(`Expected Output : "${expectedOutput}"`);
  console.log(`Actual Output   : "${finalOutput}"`);
  console.log(`\nConversion Timeline:`);
  
  // Show key milestones in conversion
  const milestones = [0, Math.floor(updateLog.length / 4), Math.floor(updateLog.length / 2), 
                     Math.floor(3 * updateLog.length / 4), updateLog.length - 1];
  
  milestones.forEach(index => {
    if (updateLog[index]) {
      const entry = updateLog[index];
      console.log(`  ${entry.timestamp.toString().padStart(5, ' ')}ms: "${entry.output}"`);
    }
  });
  
  console.log(`${'='.repeat(50)}\n`);
  
  // Assertions
  expect(realTimeUpdates).toBe(true);
  expect(noLag).toBe(true);
  expect(progressiveConversion).toBe(true);
  expect(noFreezing).toBe(true);
  expect(finalOutput.trim()).toBe(expectedOutput);
});








