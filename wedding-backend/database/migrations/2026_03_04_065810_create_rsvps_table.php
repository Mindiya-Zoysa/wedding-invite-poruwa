<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rsvps', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('side'); // 'yasara' or 'anuruddha'
            $table->string('attending'); // 'yes' or 'no'
            $table->text('message')->nullable(); 
            
            // --- NEW COLUMNS ---
            $table->integer('guest_count')->default(1);
            $table->json('additional_guests')->nullable(); // Stores the array of names
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rsvps');
    }
};
