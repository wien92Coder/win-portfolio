<?php
/**
 * Open-source (MIT) contact endpoint for the win-portfolio contact form.
 *
 * Drop this file on any PHP-capable host (cPanel/shared hosting, free tiers)
 * and point VITE_CONTACT_ENDPOINT at it. Receives the form's JSON POST,
 * validates it, guards against bots with a honeypot field, and emails you.
 *
 * Configuration: defaults live below; per-environment overrides (real Gmail
 * address + credentials) go in config.local.php next to this file, which is
 * gitignored so secrets never reach the repository.
 *
 * Two mail transports:
 *   - 'mail': PHP mail() — zero dependencies, but deliverability depends on
 *     the host's mail reputation (may land in spam).
 *   - 'smtp': PHPMailer via Composer — reliable delivery into Gmail using an
 *     App Password (requires 2-Step Verification on the Gmail account).
 */

$config = [
    'recipientEmail' => 'REPLACE_WITH_YOUR_GMAIL_ADDRESS',
    'allowedOrigin'  => '*', // or 'https://your-portfolio-domain.com'
    'mailTransport'  => 'mail', // 'mail' | 'smtp'
    'smtpHost'   => 'smtp.gmail.com',
    'smtpPort'   => 587,
    'smtpSecure' => 'tls',
    'smtpUser'   => 'REPLACE_WITH_YOUR_GMAIL_ADDRESS',
    'smtpPass'   => 'REPLACE_WITH_GOOGLE_APP_PASSWORD',
];

$localConfigFile = __DIR__ . '/config.local.php';
if (is_file($localConfigFile)) {
    $overrides = require $localConfigFile;
    if (is_array($overrides)) {
        $config = array_merge($config, $overrides);
    }
}

$recipientEmail = $config['recipientEmail'];
$allowedOrigin  = $config['allowedOrigin'];
$mailTransport  = $config['mailTransport'];
$smtp           = $config; // SMTP keys only are read from this

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// The Allow-Origin header must also appear on the OPTIONS preflight
// response, or browsers reject the request before it is ever sent.
if ($allowedOrigin === '*') {
    header('Access-Control-Allow-Origin: *');
} elseif ($origin === $allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
} elseif ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Origin not allowed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    $data = $_POST;
}

$name      = trim((string) ($data['name'] ?? ''));
$email     = trim((string) ($data['email'] ?? ''));
$phone     = trim((string) ($data['phone'] ?? ''));
$message   = trim((string) ($data['message'] ?? ''));
$honeypot  = trim((string) ($data['website'] ?? '')); // hidden field; bots fill it

if ($honeypot !== '') {
    // Pretend success to bots without doing anything.
    echo json_encode(['ok' => true]);
    exit;
}

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid submission']);
    exit;
}
if (strlen($name) > 100 || strlen($email) > 254 || strlen($phone) > 32 || strlen($message) > 5000) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Submission too large']);
    exit;
}

$subject = 'Portfolio contact from ' . $name;
$body    = "Name: $name\nEmail: $email";
if ($phone !== '') {
    $body .= "\nPhone: $phone";
}
$body   .= "\n\nMessage:\n$message";

$sent = $mailTransport === 'smtp'
    ? sendViaSmtp($subject, $body, $email, $smtp, $recipientEmail)
    : sendViaMail($subject, $body, $email, $recipientEmail);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not send']);
}

function sendViaMail(string $subject, string $body, string $replyTo, string $recipient): bool
{
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $headers = "From: website@$host\r\n" .
               "Reply-To: $replyTo\r\n" .
               'X-Mailer: PHP/' . phpversion();
    return @mail($recipient, $subject, $body, $headers);
}

function sendViaSmtp(string $subject, string $body, string $replyTo, array $smtp, string $recipient): bool
{
    require __DIR__ . '/../vendor/autoload.php'; // PHPMailer via Composer
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $smtp['smtpHost'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtp['smtpUser'];
        $mail->Password   = $smtp['smtpPass'];
        $mail->SMTPSecure = $smtp['smtpSecure'];
        $mail->Port       = (int) $smtp['smtpPort'];

        $mail->setFrom($smtp['smtpUser'], 'Win Portfolio');
        $mail->addAddress($recipient);
        $mail->addReplyTo($replyTo, $replyTo);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        return $mail->send();
    } catch (\PHPMailer\PHPMailer\Exception $e) {
        error_log('contact.php SMTP error: ' . $e->getMessage());
        return false;
    }
}