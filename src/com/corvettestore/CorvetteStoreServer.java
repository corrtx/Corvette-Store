package com.corvettestore;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;

public class CorvetteStoreServer {
    private static final int DEFAULT_PORT = 8080;
    private static final Path SITE_DIR = Paths.get("site");
    private static final String PRODUCTS_JSON =
        "[" +
            "{\"name\":\"Midnight Track Jacket\",\"description\":\"Лёгкая куртка с чистой геометрией и спортивным настроением.\",\"price\":249,\"label\":\"new\",\"gradient\":\"linear-gradient(135deg, #252525, #8a3f1d)\"}," +
            "{\"name\":\"Ivory Signature Hoodie\",\"description\":\"Плотный хлопок, мягкий объём и premium базовый оттенок.\",\"price\":189,\"label\":\"core\",\"gradient\":\"linear-gradient(135deg, #e6dccf, #a87a56)\"}," +
            "{\"name\":\"Monza Leather Cap\",\"description\":\"Минималистичная кепка с акцентом на фактуру и посадку.\",\"price\":139,\"label\":\"select\",\"gradient\":\"linear-gradient(135deg, #1a1a1a, #6e665a)\"}," +
            "{\"name\":\"Velocity Cargo Pants\",\"description\":\"Функциональный силуэт с аккуратными линиями и городской подачей.\",\"price\":219,\"label\":\"drop\",\"gradient\":\"linear-gradient(135deg, #746a60, #2f251f)\"}" +
        "]";

    public static void main(String[] args) throws IOException {
        int port = DEFAULT_PORT;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", new StaticFileHandler());
        server.createContext("/api/products", exchange -> sendResponse(exchange, PRODUCTS_JSON, "application/json; charset=utf-8"));
        server.setExecutor(Executors.newFixedThreadPool(8));
        System.out.println("Corvette Store running at http://localhost:" + port);
        server.start();
    }

    private static class StaticFileHandler implements HttpHandler {
        private static final Map<String, String> CONTENT_TYPES = new HashMap<>();

        static {
            CONTENT_TYPES.put(".html", "text/html; charset=utf-8");
            CONTENT_TYPES.put(".css", "text/css; charset=utf-8");
            CONTENT_TYPES.put(".js", "application/javascript; charset=utf-8");
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String requestPath = exchange.getRequestURI().getPath();
            if ("/".equals(requestPath)) {
                requestPath = "/index.html";
            }

            Path filePath = SITE_DIR.resolve(requestPath.substring(1)).normalize();
            if (!filePath.startsWith(SITE_DIR) || !Files.exists(filePath) || Files.isDirectory(filePath)) {
                sendNotFound(exchange);
                return;
            }

            String extension = extensionOf(filePath.getFileName().toString());
            String contentType = CONTENT_TYPES.getOrDefault(extension, "text/plain; charset=utf-8");
            byte[] body = Files.readAllBytes(filePath);

            Headers headers = exchange.getResponseHeaders();
            headers.set("Content-Type", contentType);
            exchange.sendResponseHeaders(200, body.length);
            try (OutputStream outputStream = exchange.getResponseBody()) {
                outputStream.write(body);
            }
        }
    }

    private static String extensionOf(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        return dotIndex >= 0 ? fileName.substring(dotIndex) : "";
    }

    private static void sendResponse(HttpExchange exchange, String body, String contentType) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.sendResponseHeaders(200, bytes.length);
        try (OutputStream outputStream = exchange.getResponseBody()) {
            outputStream.write(bytes);
        }
    }

    private static void sendNotFound(HttpExchange exchange) throws IOException {
        byte[] bytes = "404 Not Found".getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");
        exchange.sendResponseHeaders(404, bytes.length);
        try (OutputStream outputStream = exchange.getResponseBody()) {
            outputStream.write(bytes);
        }
    }
}
