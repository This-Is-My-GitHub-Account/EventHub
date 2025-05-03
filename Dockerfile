# 1. Use a lightweight Node image
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install                       

# 2. Copy source & expose for dev
FROM deps AS dev
WORKDIR /app
COPY . .
EXPOSE 5173                           
CMD ["npm", "run", "dev"]             

# 3. Production build
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build                     

# 4. Serve via static preview
FROM node:18-alpine AS serve
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 4173
CMD ["npm", "run", "preview"]         
