<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kayzen Izumi API</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .banner { background-image: url('/banner.jpg'); background-size: cover; background-position: center; height: 250px; }
        .profile-img { width: 120px; height: 120px; border-radius: 50%; border: 4px solid white; margin-top: -60px; }
    </style>
</head>
<body class="bg-gray-900 text-white font-sans">

    <div class="banner"></div>
    <div class="container mx-auto px-4 text-center">
        <img src="/profile.jpg" alt="Profile" class="profile-img mx-auto">
        <h1 class="text-3xl font-bold mt-4">Kayzen Izumi</h1>
        <p class="text-gray-400">@kayzenfry</p>
        
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div class="bg-gray-800 p-6 rounded-lg">
                <h2 class="text-xl font-bold mb-3 border-b border-gray-700 pb-2">About Me</h2>
                <p>Halo, saya Kayzen Izumi. Selamat datang di pusat layanan Web API milik saya.</p>
                <div class="mt-4 space-y-1 text-sm">
                    <p>WA: 628152313006</p>
                    <p>TG: @nonewpo</p>
                    <p>IG: @kayzenfry</p>
                    <p>YT: @kayzenfry</p>
                    <p>TT: @scz_kayzen</p>
                </div>
            </div>
            <div class="bg-gray-800 p-6 rounded-lg">
                <h2 class="text-xl font-bold mb-3 border-b border-gray-700 pb-2">About My Bini</h2>
                <p>Special thanks to my beloved @h___rvn.</p>
                <p class="mt-2 text-sm">Instagram: @h___rvn</p>
            </div>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6">Cosplayer Slideshow</h2>
        <div class="flex overflow-x-auto space-x-4 pb-4">
            <% for(let i=1; i<=15; i++) { %>
                <img src="/slide<%= i %>.jpg" class="h-64 rounded-lg shadow-lg">
            <% } %>
        </div>

        <h2 class="text-2xl font-bold mt-12 mb-6">My Bini Slideshow</h2>
        <div class="flex overflow-x-auto space-x-4 pb-4">
            <% for(let i=1; i<=5; i++) { %>
                <img src="/bini<%= i %>.jpg" class="h-64 rounded-lg shadow-lg">
            <% } %>
        </div>

        <div class="my-12 p-6 bg-blue-900 rounded-lg">
            <h2 class="text-xl font-bold mb-2">Update Seputar API</h2>
            <a href="https://whatsapp.com/channel/0029VbBRpUN8F2pMzHjQqz3S" class="underline">Join WhatsApp Channel</a>
            <div class="mt-6">
                <a href="/docs" class="bg-white text-blue-900 px-6 py-2 rounded-full font-bold">Buka API Documentation</a>
            </div>
        </div>
    </div>

</body>
</html>
