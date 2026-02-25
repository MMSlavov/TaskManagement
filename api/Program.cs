using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Services;
using TaskManagement.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure PostgreSQL with EF Core
var connectionString = builder.Configuration["DATABASE_URL"]
    ?? throw new InvalidOperationException("DATABASE_URL environment variable not found");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<ITaskService, TaskService>();

// Add Swagger (Development only)
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSwaggerGen();
}

var app = builder.Build();

// Configure HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
